// /opt/cbk-server/src/backtest/historicalDataLoader.ts
import { marketDataGrpc } from '../services/tbank/MarketDataGrpcService';
import { CandleInterval, CandleSourceRequest } from '../generated/marketdataTypes';
import type { StreamCandle } from './types';
import fs from 'fs-extra';
import path from 'path';

function quotationToNumber(q: any): number {
  if (!q) return 0;
  const units = Number(q.units || 0);
  const nano = q.nano || 0;
  return units + nano / 1e9;
}

function timestampToISO(ts: any): string {
  if (!ts) return new Date().toISOString();
  if (typeof ts === 'object' && ts.seconds !== undefined) {
    return new Date(ts.seconds * 1000).toISOString();
  }
  if (typeof ts === 'string') return new Date(ts).toISOString();
  return new Date().toISOString();
}

export class HistoricalDataLoader {
  private cacheDir = '/opt/cbk-server/cache'; // фиксированная папка

  private compactCandle(c: StreamCandle): any {
    return {
      o: c.open,
      h: c.high,
      l: c.low,
      c: c.close,
      v: c.volume,
      t: c.time,
    };
  }

  private expandCandle(c: any, instrumentUid: string): StreamCandle {
    return {
      instrumentUid,
      open: c.o,
      high: c.h,
      low: c.l,
      close: c.c,
      volume: c.v,
      time: c.t,
    };
  }

  /** Атомарная запись JSON (без сжатия для стабильности) */
  private async atomicWriteJson(filePath: string, data: any): Promise<void> {
    const tmpPath = filePath + '.tmp';
    try {
      const json = JSON.stringify(data);
      fs.writeFileSync(tmpPath, json, 'utf-8');
      fs.renameSync(tmpPath, filePath);
    } catch (e) {
      console.error('Failed to write cache', filePath, e);
      try { fs.unlinkSync(tmpPath); } catch {}
    }
  }

  async loadIntradayCandles(
    instrumentUid: string,
    from: Date,
    to: Date,
    token: string,
    interval: CandleInterval = CandleInterval.CANDLE_INTERVAL_1_MIN
  ): Promise<StreamCandle[]> {
    // Создаём папку кэша
    try {
      await fs.ensureDir(this.cacheDir);
    } catch (e) {
      console.error('Failed to create cache dir:', e);
    }

    const allCandles: StreamCandle[] = [];
    let currentDate = new Date(from);
    currentDate.setHours(7, 0, 0, 0); // МСК начало основной сессии

    while (currentDate <= to) {
      let dateStr = '';
      try {
        dateStr = currentDate.toISOString().split('T')[0];
        const cacheFile = path.join(this.cacheDir, `${instrumentUid}_${interval}_${dateStr}.json`);
        let dayCandles: StreamCandle[] | null = null;

        // Пытаемся прочитать из кэша (действителен 24 часа)
        try {
          if (await fs.pathExists(cacheFile)) {
            const stat = await fs.stat(cacheFile);
            const ageHours = (Date.now() - stat.mtimeMs) / 3600_000;
            if (ageHours < 24) {
              const raw = await fs.readFile(cacheFile, 'utf-8');
              const compactData = JSON.parse(raw);
              dayCandles = compactData.map((c: any) => this.expandCandle(c, instrumentUid));
              console.log(`[Cache] Loaded from cache: ${cacheFile}`);
            }
          }
        } catch (e) {
          console.error('Cache read error', dateStr, e);
        }

        // Если нет кэша, загружаем с API
        if (!dayCandles) {
          const dayFrom = new Date(currentDate);
          const dayTo = new Date(currentDate);
          dayTo.setHours(16, 0, 0, 0);
          if (dayTo > to) dayTo.setTime(to.getTime());

          const request = {
            instrumentId: instrumentUid,
            interval,
            from: { seconds: Math.floor(dayFrom.getTime() / 1000), nanos: 0 },
            to: { seconds: Math.floor(dayTo.getTime() / 1000), nanos: 0 },
            candleSourceType: CandleSourceRequest.CANDLE_SOURCE_EXCHANGE,
          };

          const response = await marketDataGrpc.getCandles(request, token);
          const candles = response.candles || [];
          dayCandles = candles.map(candle => ({
            instrumentUid,
            open: candle.open,
            high: candle.high,
            low: candle.low,
            close: candle.close,
            volume: String(candle.volume || '0'),
            time: timestampToISO(candle.time),
          }));

          // Сохраняем в кэш асинхронно
          const compactData = dayCandles.map(c => this.compactCandle(c));
          this.atomicWriteJson(cacheFile, compactData)
            .then(() => console.log(`[Cache] Saved: ${cacheFile}`))
            .catch(e => console.error('Cache write error', dateStr, e));
        }

        allCandles.push(...dayCandles);
      } catch (e) {
        console.error('Error loading day', dateStr, e);
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Автоочистка старых кэш-файлов (старше 30 дней)
    this.cleanOldCache().catch(e => console.warn('Cache cleanup error:', e));

    return allCandles;
  }

  private async cleanOldCache(maxAgeDays = 30): Promise<void> {
    let files: string[] = [];
    try {
      files = await fs.readdir(this.cacheDir);
    } catch { return; }
    const now = Date.now();
    for (const file of files) {
      const filePath = path.join(this.cacheDir, file);
      try {
        const stat = await fs.stat(filePath);
        if ((now - stat.mtimeMs) / 86400000 > maxAgeDays) {
          await fs.unlink(filePath);
        }
      } catch {}
    }
  }
}