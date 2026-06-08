// src/main/services/backtest/strategies/VABreakoutRetestStrategy.ts
import type { StreamCandle } from '../../../generated/marketdataStreamTypes';
import type { VolumeProfileLevels } from '../../../../volumeProfileEngine';
import type { IBacktestStrategy } from '../backtestEngine';
import { BacktestSignal } from '../common';
import { quotationToNumber } from '../common';

export class VABreakoutRetestStrategy implements IBacktestStrategy {
  private signals: BacktestSignal[] = [];
  private instrumentUid: string;
  private profile: VolumeProfileLevels | null;
  private brokenHigh = false;
  private brokenLow = false;
  private retestHigh = false;
  private retestLow = false;

  constructor(instrumentUid: string, profile: VolumeProfileLevels | null) {
    this.instrumentUid = instrumentUid;
    this.profile = profile;
  }

  onCandle(candle: StreamCandle): void {
    if (!this.profile) return;

    const high = quotationToNumber(candle.high);
    const low = quotationToNumber(candle.low);
    const close = quotationToNumber(candle.close);
    const volume = Number(candle.volume || '0');
    const time = candle.time || new Date().toISOString();

    const avgVolume = 50000; // можно параметризовать

    // Пробой VAH вверх
    if (high > this.profile.valueAreaHigh && volume > avgVolume * 1.2) {
      this.brokenHigh = true;
      this.brokenLow = false;
    }

    // Пробой VAL вниз
    if (low < this.profile.valueAreaLow && volume > avgVolume * 1.2) {
      this.brokenLow = true;
      this.brokenHigh = false;
    }

    // Возврат к VAH после пробоя вверх → покупаем
    if (this.brokenHigh && !this.retestHigh) {
      if (low <= this.profile.valueAreaHigh && close > this.profile.valueAreaHigh) {
        this.signals.push({
          type: 'BUY',
          price: close,
          time,
          instrumentUid: this.instrumentUid,
          reason: `Return to VAH after breakout (VAH=${this.profile.valueAreaHigh})`,
        });
        this.retestHigh = true;
        this.brokenHigh = false;
      }
    }

    // Возврат к VAL после пробоя вниз → продаём
    if (this.brokenLow && !this.retestLow) {
      if (high >= this.profile.valueAreaLow && close < this.profile.valueAreaLow) {
        this.signals.push({
          type: 'SELL',
          price: close,
          time,
          instrumentUid: this.instrumentUid,
          reason: `Return to VAL after breakout (VAL=${this.profile.valueAreaLow})`,
        });
        this.retestLow = true;
        this.brokenLow = false;
      }
    }
  }

  getSignals(): BacktestSignal[] {
    return this.signals;
  }

  clearSignals(): void {
    this.signals = [];
  }

  reset(): void {
    this.signals = [];
    this.brokenHigh = false;
    this.brokenLow = false;
    this.retestHigh = false;
    this.retestLow = false;
  }

  updateProfile(profile: VolumeProfileLevels): void {
    this.profile = profile;
    this.reset();
  }
}