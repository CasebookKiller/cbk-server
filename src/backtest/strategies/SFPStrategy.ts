// src/main/services/backtest/strategies/SFPStrategy.ts
import type { StreamCandle } from '../../../generated/marketdataStreamTypes';
import type { VolumeProfileLevels } from '../../../../volumeProfileEngine';
import type { IBacktestStrategy } from '../backtestEngine';
import { BacktestSignal } from '../common';
import { quotationToNumber } from '../common';

export class SFPStrategy implements IBacktestStrategy {
  private signals: BacktestSignal[] = [];
  private instrumentUid: string;
  private profile: VolumeProfileLevels | null;
  private previousHigh = 0;
  private previousLow = Infinity;
  private windowCandles: StreamCandle[] = [];

  constructor(instrumentUid: string, profile: VolumeProfileLevels | null) {
    this.instrumentUid = instrumentUid;
    this.profile = profile;
  }

  onCandle(candle: StreamCandle): void {
    const high = quotationToNumber(candle.high);
    const low = quotationToNumber(candle.low);
    const close = quotationToNumber(candle.close);
    const volume = Number(candle.volume || '0');
    const time = candle.time || new Date().toISOString();

    // Накапливаем последние N свечей для определения экстремумов
    this.windowCandles.push(candle);
    if (this.windowCandles.length > 10) {
      this.windowCandles.shift();
    }

    if (this.windowCandles.length >= 3) {
      const prevCandles = this.windowCandles.slice(0, -1);
      this.previousHigh = Math.max(...prevCandles.map(c => quotationToNumber(c.high)));
      this.previousLow = Math.min(...prevCandles.map(c => quotationToNumber(c.low)));
    }

    // Ложный пробой максимума
    if (high > this.previousHigh && close < this.previousHigh && volume > this.averageVolume() * 1.3) {
      this.signals.push({
        type: 'SELL',
        price: close,
        time,
        instrumentUid: this.instrumentUid,
        reason: `Swing failure – false breakout above ${this.previousHigh}`,
      });
    }

    // Ложный пробой минимума
    if (low < this.previousLow && close > this.previousLow && volume > this.averageVolume() * 1.3) {
      this.signals.push({
        type: 'BUY',
        price: close,
        time,
        instrumentUid: this.instrumentUid,
        reason: `Swing failure – false breakdown below ${this.previousLow}`,
      });
    }
  }

  private averageVolume(): number {
    if (this.windowCandles.length === 0) return 0;
    const total = this.windowCandles.reduce((s, c) => s + Number(c.volume || '0'), 0);
    return total / this.windowCandles.length;
  }

  getSignals(): BacktestSignal[] {
    return this.signals;
  }

  clearSignals(): void {
    this.signals = [];
  }

  reset(): void {
    this.signals = [];
    this.windowCandles = [];
    this.previousHigh = 0;
    this.previousLow = Infinity;
  }

  updateProfile(profile: VolumeProfileLevels): void {
    this.profile = profile;
    this.reset();
  }
}