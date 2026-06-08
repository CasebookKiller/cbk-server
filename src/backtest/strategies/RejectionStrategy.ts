import type { StreamCandle } from '../../../generated/marketdataStreamTypes';
import type { VolumeProfileLevels } from '../../../../volumeProfileEngine';
import type { IBacktestStrategy } from '../backtestEngine';
import { BacktestSignal, quotationToNumber } from '../common';

export class RejectionStrategy implements IBacktestStrategy {
  private signals: BacktestSignal[] = [];
  private dailyProfile: VolumeProfileLevels | null = null;
  private instrumentUid: string;
  private hasPosition = false;

  constructor(instrumentUid: string, dailyProfile: VolumeProfileLevels | null) {
    this.instrumentUid = instrumentUid;
    this.dailyProfile = dailyProfile;
  }

  reset(): void {
    this.signals = [];
    this.hasPosition = false;
  }

  onCandle(candle: StreamCandle): void {
    if (!this.dailyProfile || this.hasPosition) return;

    const open = quotationToNumber(candle.open);
    const high = quotationToNumber(candle.high);
    const low = quotationToNumber(candle.low);
    const close = quotationToNumber(candle.close);
    const time = candle.time || new Date().toISOString();

    const body = Math.abs(close - open);
    const upperWick = high - Math.max(open, close);
    const lowerWick = Math.min(open, close) - low;
    const totalRange = high - low;
    if (totalRange === 0) return;

    // Проверка "хвоста": минимум 60% диапазона свечи должно быть тенью
    const isRejectionUp = lowerWick > totalRange * 0.6 && body < totalRange * 0.3;
    const isRejectionDown = upperWick > totalRange * 0.6 && body < totalRange * 0.3;

    if (!isRejectionUp && !isRejectionDown) return;

    // Проверяем, находится ли цена вблизи уровня HVN
    const hvnLevels = this.dailyProfile.hvn || [];
    const nearHVN = hvnLevels.some(level => Math.abs(close - level) < 1.0); // допуск 1 рубль
    if (!nearHVN) return;

    if (isRejectionDown) {
      this.signals.push({
        type: 'SELL',
        price: close,
        time,
        instrumentUid: this.instrumentUid,
        reason: `Rejection down from HVN`,
      });
      this.hasPosition = true;
    } else if (isRejectionUp) {
      this.signals.push({
        type: 'BUY',
        price: close,
        time,
        instrumentUid: this.instrumentUid,
        reason: `Rejection up from HVN`,
      });
      this.hasPosition = true;
    }
  }

  getSignals(): BacktestSignal[] { return this.signals; }
  clearSignals(): void { this.signals = []; }
  updateProfile(profile: VolumeProfileLevels): void {
    this.dailyProfile = profile;
    this.hasPosition = false;
  }
}