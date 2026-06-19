// /opt/cbk-server/src/backtest/phaseWorker.ts
import { HistoricalDataLoader } from './historicalDataLoader';
import SBase from '../../supabaseClient';
import fs from 'fs-extra';
import path from 'path';
import { CandleInterval } from '../generated/marketdataTypes';

const PHASE_CACHE_DIR = '/opt/cbk-server/phase_cache';

// Простой детектор фазы (как раньше)
function detectDayPhase(candles: any[]): string {
  if (!candles || candles.length < 5) return 'CHOP';
  const totalVolume = candles.reduce((s, c) => s + Number(c.volume || 0), 0);
  if (totalVolume === 0) return 'CHOP';
  const vwap = candles.reduce((s, c) => s + (Number(c.high) + Number(c.low) + Number(c.close)) / 3 * Number(c.volume), 0) / totalVolume;
  const prices = candles.map(c => Number(c.close));
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const step = (maxPrice - minPrice) / 50;
  const volumeMap = new Map<number, number>();
  candles.forEach(c => {
    const close = Number(c.close);
    const level = Math.round(close / step) * step;
    volumeMap.set(level, (volumeMap.get(level) || 0) + Number(c.volume || 0));
  });
  let poc = 0, maxVol = 0;
  volumeMap.forEach((vol, price) => { if (vol > maxVol) { maxVol = vol; poc = price; } });
  const sortedLevels = Array.from(volumeMap.entries()).sort((a, b) => b[1] - a[1]);
  let vaVolume = 0, vaHigh = poc, vaLow = poc;
  const targetVol = totalVolume * 0.7;
  for (const [price, vol] of sortedLevels) {
    vaVolume += vol;
    if (price > vaHigh) vaHigh = price;
    if (price < vaLow) vaLow = price;
    if (vaVolume >= targetVol) break;
  }
  const vaWidth = poc > 0 ? ((vaHigh - vaLow) / poc) * 100 : 0;
  const insideVA = candles.filter(c => Number(c.close) >= vaLow && Number(c.close) <= vaHigh).length;
  const percentInside = (insideVA / candles.length) * 100;
  const last = candles[candles.length - 1];
  const close = Number(last.close);
  const high = Number(last.high);
  const low = Number(last.low);
  const avgVol = totalVolume / candles.length;
  const spike = Number(last.volume) > avgVol * 1.5;
  const vwapTrend = vwap > 0 ? ((close - vwap) / vwap) * 100 : 0;
  if (vaWidth < 5.0 && percentInside > 50) return 'BALANCE';
  if (vaWidth > 4.0 && spike && (high > vaHigh || low < vaLow)) return 'BREAKOUT';
  if (vwapTrend > 0.5 && close > vaHigh) return 'TREND_UP';
  if (vwapTrend < -0.5 && close < vaLow) return 'TREND_DOWN';
  return 'CHOP';
}

export class PhaseWorker {
  private loader = new HistoricalDataLoader();

  /** Обработать одну задачу */
  async processTask(taskId: string, instrumentUid: string, dateFrom: string, dateTo: string, interval: CandleInterval) {
    await fs.ensureDir(PHASE_CACHE_DIR);
    const days: string[] = [];
    const cur = new Date(dateFrom + 'T00:00:00Z');
    const end = new Date(dateTo + 'T00:00:00Z');

    while (cur <= end) {
      const dateStr = cur.toISOString().split('T')[0];
      const phase = await this.getPhaseForDay(instrumentUid, dateStr, interval);
      days.push(phase);
      cur.setDate(cur.getDate() + 1);
    }

    // Сохраняем массив фаз в задачу
    const { error } = await (SBase.from('backtest_tasks') as any)
      .update({
        market_phases: days,
        phase_status: 'completed'
      })
      .eq('task_id', taskId);

    if (error) {
      console.error(`[PhaseWorker] Failed to update task ${taskId}:`, error);
    } else {
      console.log(`[PhaseWorker] Task ${taskId} updated (${days.length} phases)`);
    }
  }

  /** Получить фазу для конкретного дня (из кэша или вычислить) */
  private async getPhaseForDay(uid: string, dateStr: string, interval: CandleInterval): Promise<string> {
    const cacheFile = path.join(PHASE_CACHE_DIR, `${uid}_${dateStr}.json`);
    try {
      if (await fs.pathExists(cacheFile)) {
        const raw = await fs.readFile(cacheFile, 'utf-8');
        const data = JSON.parse(raw);
        return data.phase;
      }
    } catch (e) {
      console.warn(`[PhaseWorker] Cache read error for ${dateStr}`, e);
    }

    // Вычисляем фазу
    const dayStart = new Date(dateStr + 'T07:00:00Z');
    const dayEnd = new Date(dateStr + 'T16:00:00Z');
    const candles = await this.loader.loadIntradayCandles(
      uid, dayStart, dayEnd, process.env.TReadOnly || '', interval
    );
    const phase = detectDayPhase(candles);

    // Сохраняем в кэш
    try {
      await fs.writeFile(cacheFile, JSON.stringify({ phase, date: dateStr }), 'utf-8');
    } catch (e) {
      console.warn(`[PhaseWorker] Cache write error for ${dateStr}`, e);
    }
    return phase;
  }

  /** Периодически вызывается извне для обработки pending-задач */
  async processPendingTasks() {
    try {
      const { data: tasks } = await (SBase as any)
        .from('backtest_tasks')
        .select('task_id, instrument_uid, date_from, date_to, interval')
        .eq('phase_status', 'pending')
        .limit(1);

      if (tasks && tasks.length > 0) {
        const t = tasks[0];
        console.log(`[PhaseWorker] Processing task ${t.task_id}`);
        await this.processTask(t.task_id, t.instrument_uid, t.date_from, t.date_to, t.interval);
      }
    } catch (err) {
      console.error('[PhaseWorker] Error in processPendingTasks:', err);
    }
  }
}