// /opt/cbk-server/src/backtest/screenerService.ts
import { HistoricalDataLoader } from './historicalDataLoader';
import { VolumeProfileEngine } from './volumeProfileEngine';
import { CandleInterval } from '../generated/marketdataTypes';
import type { StreamCandle } from './types';

export interface ScreenerFilters {
  minDailyVolume?: number;
  maxVaWidthPercent?: number;
  minPocStrength?: number;
}

export interface ScreenerResult {
  figi: string;
  ticker: string;
  name: string;
  uid: string;
  lastPrice: number;
  avgVolume: number;
  vaWidthPercent: number;
  pocStrength: number;
}

export class ScreenerService {
  constructor(
    private historicalLoader: HistoricalDataLoader,
    private token: string
  ) {}

  async screen(filters: ScreenerFilters, instruments: Array<{ uid: string; ticker: string; name: string }>): Promise<ScreenerResult[]> {
    const results: ScreenerResult[] = [];
    const now = new Date();
    const twoDaysAgo = new Date(now.getTime() - 2 * 86400000);

    for (const instr of instruments) {
      try {
        const uid = instr.uid;
        if (!uid) continue;

        const candles = await this.historicalLoader.loadIntradayCandles(
          uid, twoDaysAgo, now, this.token, CandleInterval.CANDLE_INTERVAL_HOUR
        );
        if (!candles || candles.length < 5) continue;

        const avgVolume = candles.reduce((s: number, c: StreamCandle) => s + Number(c.volume || '0'), 0) / candles.length;
        if (filters.minDailyVolume && avgVolume < filters.minDailyVolume) continue;

        const engine = new VolumeProfileEngine({
          profileResolution: 50,
          valueAreaPercent: 70,
          skipAutoSubscribe: true,
        });
        candles.forEach(c => engine.feedCandle(c));
        const profile = engine.getProfile(uid);
        if (!profile) continue;

        const vaWidth = profile.valueAreaHigh - profile.valueAreaLow;
        const vaWidthPercent = (vaWidth / profile.poc) * 100;
        if (filters.maxVaWidthPercent && vaWidthPercent > filters.maxVaWidthPercent) continue;

        const pocEntry = profile.volumeByPrice.find(v => v.price === profile.poc);
        const pocVolume = pocEntry ? pocEntry.volume : 0;
        const pocStrength = profile.totalVolume > 0 ? pocVolume / profile.totalVolume : 0;
        if (filters.minPocStrength && pocStrength < filters.minPocStrength) continue;

        results.push({
          figi: '',
          ticker: instr.ticker,
          name: instr.name,
          uid: instr.uid,          // ← uid инструмента
          lastPrice: profile.poc,
          avgVolume,
          vaWidthPercent: Math.round(vaWidthPercent * 100) / 100,
          pocStrength: Math.round(pocStrength * 100) / 100,
        });
      } catch (err) {
        console.warn(`Screener: error for ${instr.ticker}`, err);
      }
    }
    return results;
  }
}