// src/main/services/backtest/strategies/ExhaustionStrategy.ts
import type { StreamCandle } from '../../../generated/marketdataStreamTypes';
import type { VolumeProfileLevels } from '../../../../volumeProfileEngine';
import type { IBacktestStrategy } from '../backtestEngine';
import { BacktestSignal } from '../common';
import { quotationToNumber } from '../common';
import { OrderFlowEngine } from '../../../orderFlowEngine';

export class ExhaustionStrategy implements IBacktestStrategy {
  private signals: BacktestSignal[] = [];
  private instrumentUid: string;
  private profile: VolumeProfileLevels | null;
  private orderFlow: OrderFlowEngine;

  constructor(instrumentUid: string, profile: VolumeProfileLevels | null, orderFlow: OrderFlowEngine) {
    this.instrumentUid = instrumentUid;
    this.profile = profile;
    this.orderFlow = orderFlow;
  }

  onCandle(candle: StreamCandle): void {
    const exhaustion = this.orderFlow.detectExhaustion(this.instrumentUid);
    if (!exhaustion) return;

    const close = quotationToNumber(candle.close);
    const time = candle.time || new Date().toISOString();

    if (exhaustion.type === 'bearish') {
      this.signals.push({
        type: 'SELL',
        price: close,
        time,
        instrumentUid: this.instrumentUid,
        reason: `Bearish exhaustion (price high, delta negative)`,
      });
    } else if (exhaustion.type === 'bullish') {
      this.signals.push({
        type: 'BUY',
        price: close,
        time,
        instrumentUid: this.instrumentUid,
        reason: `Bullish exhaustion (price low, delta positive)`,
      });
    }
  }

  getSignals(): BacktestSignal[] { return this.signals; }
  clearSignals(): void { this.signals = []; }
  reset(): void { this.signals = []; }
  updateProfile(profile: VolumeProfileLevels): void { this.profile = profile; }
}