import type { StreamCandle } from '../types';
import type { VolumeProfileLevels } from '../volumeProfileEngine';
import type { IBacktestStrategy } from '../backtestEngine';
import { BacktestSignal, quotationToNumber } from '../common';

export class DailyVAReversalStrategy implements IBacktestStrategy {
  private signals: BacktestSignal[] = [];
  private dailyProfile: VolumeProfileLevels | null = null;
  private instrumentUid: string;
  private aboveVA = false;
  private belowVA = false;
  private hasPosition = false;

  constructor(instrumentUid: string, dailyProfile: VolumeProfileLevels | null) {
    this.instrumentUid = instrumentUid;
    this.dailyProfile = dailyProfile;
  }

  reset(): void {
    this.signals = [];
    this.aboveVA = false;
    this.belowVA = false;
    this.hasPosition = false;
  }

  onCandle(candle: StreamCandle): void {
    if (!this.dailyProfile || this.hasPosition) return;

    const high = quotationToNumber(candle.high);
    const low = quotationToNumber(candle.low);
    const close = quotationToNumber(candle.close);
    const time = candle.time || new Date().toISOString();
    const vah = this.dailyProfile.valueAreaHigh;
    const val = this.dailyProfile.valueAreaLow;

    // Отслеживаем выход за VA
    if (high > vah) { this.aboveVA = true; this.belowVA = false; }
    if (low < val) { this.belowVA = true; this.aboveVA = false; }

    // Возврат внутрь VA после выхода вверх → SELL
    if (this.aboveVA && close < vah) {
      this.signals.push({
        type: 'SELL',
        price: close,
        time,
        instrumentUid: this.instrumentUid,
        reason: `Return to VA after breaking high (VAH=${vah})`,
      });
      this.hasPosition = true;
      this.aboveVA = false;
    }

    // Возврат внутрь VA после выхода вниз → BUY
    if (this.belowVA && close > val) {
      this.signals.push({
        type: 'BUY',
        price: close,
        time,
        instrumentUid: this.instrumentUid,
        reason: `Return to VA after breaking low (VAL=${val})`,
      });
      this.hasPosition = true;
      this.belowVA = false;
    }
  }

  getSignals(): BacktestSignal[] { return this.signals; }
  clearSignals(): void { this.signals = []; }
  updateProfile(profile: VolumeProfileLevels): void {
    this.dailyProfile = profile;
    this.aboveVA = false;
    this.belowVA = false;
    this.hasPosition = false;
  }
}