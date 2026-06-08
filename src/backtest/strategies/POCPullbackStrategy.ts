import type { StreamCandle } from '../../../generated/marketdataStreamTypes';
import type { VolumeProfileLevels } from '../../../../volumeProfileEngine';
import type { IBacktestStrategy } from '../backtestEngine';
import { BacktestSignal, quotationToNumber } from '../common';

export class POCPullbackStrategy implements IBacktestStrategy {
  private signals: BacktestSignal[] = [];
  private dailyProfile: VolumeProfileLevels | null = null;
  private instrumentUid: string;
  private priceAbovePOC = false;
  private priceBelowPOC = false;
  private hasPosition = false;

  constructor(instrumentUid: string, dailyProfile: VolumeProfileLevels | null) {
    this.instrumentUid = instrumentUid;
    this.dailyProfile = dailyProfile;
  }

  reset(): void {
    this.signals = [];
    this.priceAbovePOC = false;
    this.priceBelowPOC = false;
    this.hasPosition = false;
  }

  onCandle(candle: StreamCandle): void {
    if (!this.dailyProfile || this.hasPosition) return;

    const high = quotationToNumber(candle.high);
    const low = quotationToNumber(candle.low);
    const close = quotationToNumber(candle.close);
    const time = candle.time || new Date().toISOString();
    const poc = this.dailyProfile.poc;

    if (high > poc) {
      this.priceAbovePOC = true;
      this.priceBelowPOC = false;
    }
    if (low < poc) {
      this.priceBelowPOC = true;
      this.priceAbovePOC = false;
    }

    if (this.priceAbovePOC && close <= poc) {
      this.signals.push({
        type: 'BUY',
        price: close,
        time,
        instrumentUid: this.instrumentUid,
        reason: `POC Pullback long from above (POC=${poc})`,
      });
      this.hasPosition = true;
      this.priceAbovePOC = false;
    }

    if (this.priceBelowPOC && close >= poc) {
      this.signals.push({
        type: 'SELL',
        price: close,
        time,
        instrumentUid: this.instrumentUid,
        reason: `POC Pullback short from below (POC=${poc})`,
      });
      this.hasPosition = true;
      this.priceBelowPOC = false;
    }
  }

  getSignals(): BacktestSignal[] {
    return this.signals;
  }

  clearSignals(): void {
    this.signals = [];
  }

  updateProfile(profile: VolumeProfileLevels): void {
    this.dailyProfile = profile;
    this.priceAbovePOC = false;
    this.priceBelowPOC = false;
    this.hasPosition = false;
  }
}