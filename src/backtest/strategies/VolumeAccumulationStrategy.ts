// /opt/cbk-server/src/backtest/strategies/VolumeAccumulationStrategy.ts

import type { StreamCandle } from '../types';
import type { VolumeProfileLevels } from '../volumeProfileEngine';
import type { IBacktestStrategy } from '../backtestEngine';
import { BacktestSignal } from '../common';

export class VolumeAccumulationStrategy implements IBacktestStrategy {
  private signals: BacktestSignal[] = [];
  private dailyProfile: VolumeProfileLevels | null = null;
  private instrumentUid: string;
  private hasBrokenHigh = false;
  private hasBrokenLow = false;
  private volumeFilterEnabled: boolean;
  private volumeFilterPeriod: number;
  private volumeHistory: number[] = [];
  private lastSignalDirection: string | null = null;
  private maxSignalsPerDay: number = 0;
  private minIntervalMs: number = 0;
  private signalsToday: number = 0;
  private lastSignalTime: number = 0;

  constructor(
    instrumentUid: string,
    dailyProfile: VolumeProfileLevels | null,
    options?: {
      volumeFilterEnabled?: boolean;
      volumeFilterPeriod?: number;
      maxSignalsPerDay?: number;
      minIntervalMinutes?: number;
    }
  ) {
    this.instrumentUid = instrumentUid;
    this.dailyProfile = dailyProfile;
    this.volumeFilterEnabled = options?.volumeFilterEnabled ?? false;
    this.volumeFilterPeriod = options?.volumeFilterPeriod ?? 20;
    this.maxSignalsPerDay = options?.maxSignalsPerDay ?? 0;
    this.minIntervalMs = (options?.minIntervalMinutes ?? 15) * 60 * 1000;
  }

  reset(): void {
    this.signals = [];
    this.hasBrokenHigh = false;
    this.hasBrokenLow = false;
    this.hasPosition = false;
    this.volumeHistory = [];
  }

  private hasPosition = false;

  onCandle(candle: StreamCandle): void {
    if (!this.dailyProfile || this.hasPosition) return;

    const high = quotationToNumber(candle.high);
    const low = quotationToNumber(candle.low);
    const close = quotationToNumber(candle.close);
    const time = candle.time || new Date().toISOString();

    const volume = Number(candle.volume || '0');
    this.volumeHistory.push(volume);
    if (this.volumeHistory.length > this.volumeFilterPeriod) {
      this.volumeHistory.shift();
    }

    if (this.volumeFilterEnabled && this.volumeHistory.length >= this.volumeFilterPeriod) {
      const avgVolume = this.volumeHistory.reduce((a, b) => a + b, 0) / this.volumeHistory.length;
      if (volume < avgVolume) return;
    }

    // отслеживаем пробои
    if (high > this.dailyProfile.valueAreaHigh) {
      this.hasBrokenHigh = true;
      this.hasBrokenLow = false;
    }
    if (low < this.dailyProfile.valueAreaLow) {
      this.hasBrokenLow = true;
      this.hasBrokenHigh = false;
    }

    if (this.maxSignalsPerDay > 0 && this.signalsToday >= this.maxSignalsPerDay) return;
    const now = Date.now();
    if (this.minIntervalMs > 0 && (now - this.lastSignalTime) < this.minIntervalMs) return;

    // возврат в VA после пробоя
    if (this.hasBrokenHigh && close < this.dailyProfile.valueAreaHigh) {
      this.signals.push({
        type: 'SELL',
        price: close,
        time,
        instrumentUid: this.instrumentUid,
        reason: `Return to VA after breaking high (VAH=${this.dailyProfile.valueAreaHigh})`,
      });
      this.hasBrokenHigh = false;
      this.hasPosition = true;
      this.signalsToday++;
      this.lastSignalTime = now;
    }

    if (this.hasBrokenLow && close > this.dailyProfile.valueAreaLow) {
      this.signals.push({
        type: 'BUY',
        price: close,
        time,
        instrumentUid: this.instrumentUid,
        reason: `Return to VA after breaking low (VAL=${this.dailyProfile.valueAreaLow})`,
      });
      this.hasBrokenLow = false;
      this.hasPosition = true;
    }
  }

  getSignals(): BacktestSignal[] { return this.signals; }
  clearSignals(): void { this.signals = []; }

  updateProfile(profile: VolumeProfileLevels): void {
    this.dailyProfile = profile;
    this.hasPosition = false;
    this.hasBrokenHigh = false;
    this.hasBrokenLow = false;
    this.volumeHistory = [];
    this.signalsToday = 0;
    this.lastSignalTime = 0;
  }
}

function quotationToNumber(q: any): number {
  if (!q) return 0;
  const units = Number(q.units || 0);
  const nano = q.nano || 0;
  return units + nano / 1e9;
}