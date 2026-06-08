import type { StreamCandle } from '../types';
import type { VolumeProfileLevels } from '../volumeProfileEngine';
import type { IBacktestStrategy } from '../backtestEngine';
import { BacktestSignal, quotationToNumber } from '../common';

interface FVG {
  type: 'bullish' | 'bearish';
  top: number;
  bottom: number;
  time: string;
}

export class TrendStrategyPro implements IBacktestStrategy {
  private signals: BacktestSignal[] = [];
  private dailyProfile: VolumeProfileLevels | null = null;
  private instrumentUid: string;
  private prevCandle: StreamCandle | null = null;
  private fvgList: FVG[] = [];
  private hasPosition = false;

  constructor(instrumentUid: string, dailyProfile: VolumeProfileLevels | null) {
    this.instrumentUid = instrumentUid;
    this.dailyProfile = dailyProfile;
  }

  reset(): void {
    this.signals = [];
    this.prevCandle = null;
    this.fvgList = [];
    this.hasPosition = false;
  }

  onCandle(candle: StreamCandle): void {
    if (!this.dailyProfile || this.hasPosition) return;

    const close = quotationToNumber(candle.close);
    const time = candle.time || new Date().toISOString();
    const vah = this.dailyProfile.valueAreaHigh;
    const val = this.dailyProfile.valueAreaLow;
    const hvnLevels = this.dailyProfile.hvn || [];

    // Поиск FVG
    if (this.prevCandle) {
      const prevHigh = quotationToNumber(this.prevCandle.high);
      const prevLow = quotationToNumber(this.prevCandle.low);
      const curLow = quotationToNumber(candle.low);
      const curHigh = quotationToNumber(candle.high);

      if (curLow > prevHigh) {
        this.fvgList.push({ type: 'bullish', top: curLow, bottom: prevHigh, time });
      } else if (curHigh < prevLow) {
        this.fvgList.push({ type: 'bearish', top: prevLow, bottom: curHigh, time });
      }
    }
    this.prevCandle = candle;

    // Проверка тренда и пересечения FVG с HVN
    for (const fvg of this.fvgList) {
      const overlap = hvnLevels.some((level: number) => level >= fvg.bottom && level <= fvg.top);
      if (!overlap) continue;

      // Бычий тренд (цена выше VA High) + бычий FVG
      if (close > vah && fvg.type === 'bullish') {
        this.signals.push({
          type: 'BUY',
          price: close,
          time,
          instrumentUid: this.instrumentUid,
          reason: `Trend Pro: Bullish FVG + HVN above VAH`,
        });
        this.hasPosition = true;
        this.fvgList = [];
        return;
      }

      // Медвежий тренд (цена ниже VA Low) + медвежий FVG
      if (close < val && fvg.type === 'bearish') {
        this.signals.push({
          type: 'SELL',
          price: close,
          time,
          instrumentUid: this.instrumentUid,
          reason: `Trend Pro: Bearish FVG + HVN below VAL`,
        });
        this.hasPosition = true;
        this.fvgList = [];
        return;
      }
    }
  }

  getSignals(): BacktestSignal[] { return this.signals; }
  clearSignals(): void { this.signals = []; }
  updateProfile(profile: VolumeProfileLevels): void {
    this.dailyProfile = profile;
    this.fvgList = [];
    this.prevCandle = null;
    this.hasPosition = false;
  }
}