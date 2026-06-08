// src/main/services/backtest/strategies/InitialBalanceStrategy.ts
import type { StreamCandle } from '../../../generated/marketdataStreamTypes';
import type { VolumeProfileLevels } from '../../../../volumeProfileEngine';
import type { IBacktestStrategy } from '../backtestEngine';
import { BacktestSignal } from '../common';
import { quotationToNumber } from '../common';

export class InitialBalanceStrategy implements IBacktestStrategy {
  private signals: BacktestSignal[] = [];
  private ibHigh = 0;
  private ibLow = 0;
  private ibPeriodMinutes: number;
  private instrumentUid: string;
  private profile: VolumeProfileLevels | null;
  private candlesInPeriod: any[] = [];
  private periodExpired = false;

  constructor(instrumentUid: string, profile: VolumeProfileLevels | null, ibMinutes: number = 60) {
    this.instrumentUid = instrumentUid;
    this.profile = profile;
    this.ibPeriodMinutes = ibMinutes;
  }

  onCandle(candle: StreamCandle): void {
    if (this.periodExpired) return;

    const time = candle.time || new Date().toISOString();
    const high = quotationToNumber(candle.high);
    const low = quotationToNumber(candle.low);
    const close = quotationToNumber(candle.close);
    const volume = Number(candle.volume || '0');

    // Накапливаем свечи IB периода
    this.candlesInPeriod.push({ time, high, low, close, volume });
    const elapsedMinutes = (new Date(time).getTime() - new Date(this.candlesInPeriod[0].time).getTime()) / 60000;
    
    if (elapsedMinutes >= this.ibPeriodMinutes) {
      // Вычисляем границы IB
      this.ibHigh = Math.max(...this.candlesInPeriod.map(c => c.high));
      this.ibLow = Math.min(...this.candlesInPeriod.map(c => c.low));
      this.periodExpired = true;
    } else {
      return; // ещё не закончился период
    }

    // После окончания IB периода проверяем пробой
    if (close > this.ibHigh && volume > this.averageVolume() * 1.5) {
      this.signals.push({
        type: 'BUY',
        price: close,
        time,
        instrumentUid: this.instrumentUid,
        reason: `IB breakout up (high=${this.ibHigh})`,
      });
    } else if (close < this.ibLow && volume > this.averageVolume() * 1.5) {
      this.signals.push({
        type: 'SELL',
        price: close,
        time,
        instrumentUid: this.instrumentUid,
        reason: `IB breakout down (low=${this.ibLow})`,
      });
    }
  }

  private averageVolume(): number {
    if (this.candlesInPeriod.length === 0) return 0;
    return this.candlesInPeriod.reduce((s, c) => s + c.volume, 0) / this.candlesInPeriod.length;
  }

  getSignals(): BacktestSignal[] {
    return this.signals;
  }

  clearSignals(): void {
    this.signals = [];
  }

  reset(): void {
    this.signals = [];
    this.periodExpired = false;
    this.candlesInPeriod = [];
    this.ibHigh = 0;
    this.ibLow = 0;
  }

  updateProfile(profile: VolumeProfileLevels): void {
    this.profile = profile;
    this.reset();
  }
}