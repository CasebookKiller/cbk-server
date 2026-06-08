// src/main/services/backtest/strategies/AnchoredVWAPStrategy.ts
import type { StreamCandle } from '../../../generated/marketdataStreamTypes';
import type { VolumeProfileLevels } from '../../../../volumeProfileEngine';
import type { IBacktestStrategy } from '../backtestEngine';
import { BacktestSignal } from '../common';
import { quotationToNumber } from '../common';

export class AnchoredVWAPStrategy implements IBacktestStrategy {
  private signals: BacktestSignal[] = [];
  private instrumentUid: string;
  private profile: VolumeProfileLevels | null;
  private anchorTime: number;
  private vwapNumerator = 0;
  private vwapDenominator = 0;
  private avwapValues: number[] = [];
  private currentAVWAP = 0;
  private trendDirection: 'up' | 'down' | null = null;
  private trendConfirmed = false;

  constructor(instrumentUid: string, profile: VolumeProfileLevels | null, anchorTime?: Date) {
    this.instrumentUid = instrumentUid;
    this.profile = profile;
    this.anchorTime = anchorTime ? anchorTime.getTime() : Date.now() - 3600_000;
  }

  onCandle(candle: StreamCandle): void {
    const time = new Date(candle.time || Date.now()).getTime();
    if (time < this.anchorTime) return;

    const high = quotationToNumber(candle.high);
    const low = quotationToNumber(candle.low);
    const close = quotationToNumber(candle.close);
    const volume = Number(candle.volume || '0');
    const typicalPrice = (high + low + close) / 3;

    this.vwapNumerator += typicalPrice * volume;
    this.vwapDenominator += volume;
    this.currentAVWAP = this.vwapDenominator > 0 ? this.vwapNumerator / this.vwapDenominator : close;

    this.avwapValues.push(this.currentAVWAP);
    if (this.avwapValues.length > 20) this.avwapValues.shift();

    if (this.avwapValues.length >= 5) {
      const first = this.avwapValues[this.avwapValues.length - 5];
      const last = this.avwapValues[this.avwapValues.length - 1];
      const change = (last - first) / first;
      if (change > 0.001) {
        this.trendDirection = 'up';
        this.trendConfirmed = true;
      } else if (change < -0.001) {
        this.trendDirection = 'down';
        this.trendConfirmed = true;
      } else {
        this.trendConfirmed = false;
      }
    }

    if (!this.trendConfirmed) return;

    if (this.trendDirection === 'up' && low <= this.currentAVWAP && close > this.currentAVWAP) {
      this.signals.push({
        type: 'BUY',
        price: close,
        time: candle.time || new Date().toISOString(),
        instrumentUid: this.instrumentUid,
        reason: `Bounce off AVWAP in uptrend (AVWAP=${this.currentAVWAP.toFixed(2)})`,
      });
    } else if (this.trendDirection === 'down' && high >= this.currentAVWAP && close < this.currentAVWAP) {
      this.signals.push({
        type: 'SELL',
        price: close,
        time: candle.time || new Date().toISOString(),
        instrumentUid: this.instrumentUid,
        reason: `Bounce off AVWAP in downtrend (AVWAP=${this.currentAVWAP.toFixed(2)})`,
      });
    }
  }

  getSignals(): BacktestSignal[] { return this.signals; }
  clearSignals(): void { this.signals = []; }
  reset(): void {
    this.signals = [];
    this.vwapNumerator = 0;
    this.vwapDenominator = 0;
    this.avwapValues = [];
    this.currentAVWAP = 0;
    this.trendConfirmed = false;
    this.trendDirection = null;
  }
  updateProfile(profile: VolumeProfileLevels): void { this.profile = profile; }
}