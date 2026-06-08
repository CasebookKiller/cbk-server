// src/main/services/backtest/strategies/AbsorptionStrategy.ts
import type { StreamCandle } from '../../../generated/marketdataStreamTypes';
import type { VolumeProfileLevels } from '../../../../volumeProfileEngine';
import type { IBacktestStrategy } from '../backtestEngine';
import { BacktestSignal } from '../common';
import { quotationToNumber } from '../common';
import { OrderFlowEngine } from '../../../orderFlowEngine';

export class AbsorptionStrategy implements IBacktestStrategy {
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
    const absorption = this.orderFlow.detectAbsorption(this.instrumentUid);
    if (!absorption) return;

    const close = quotationToNumber(candle.close);
    const time = candle.time || new Date().toISOString();

    // Вход в сторону абсорбции
    if (absorption.side === 'ask') {
      this.signals.push({
        type: 'BUY',
        price: close,
        time,
        instrumentUid: this.instrumentUid,
        reason: `Absorption of ask wall at ${absorption.priceLevel}`,
      });
    } else if (absorption.side === 'bid') {
      this.signals.push({
        type: 'SELL',
        price: close,
        time,
        instrumentUid: this.instrumentUid,
        reason: `Absorption of bid wall at ${absorption.priceLevel}`,
      });
    }
  }

  getSignals(): BacktestSignal[] { return this.signals; }
  clearSignals(): void { this.signals = []; }
  reset(): void { this.signals = []; }
  updateProfile(profile: VolumeProfileLevels): void { this.profile = profile; }
}