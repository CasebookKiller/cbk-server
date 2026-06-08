import type { StreamCandle } from '../../../generated/marketdataStreamTypes';
import type { VolumeProfileLevels } from '../../../../volumeProfileEngine';
import type { IBacktestStrategy } from '../backtestEngine';
import { BacktestSignal, quotationToNumber } from '../common';

interface FVG {
  type: 'bullish' | 'bearish';
  top: number;
  bottom: number;
  time: string;
}

export class FVGVolumeStrategy implements IBacktestStrategy {
  private signals: BacktestSignal[] = [];
  private dailyProfile: VolumeProfileLevels | null = null;
  private instrumentUid: string;
  private fvgList: FVG[] = [];
  private hasPosition = false;
  private prevCandle: StreamCandle | null = null;

  constructor(instrumentUid: string, dailyProfile: VolumeProfileLevels | null) {
    this.instrumentUid = instrumentUid;
    this.dailyProfile = dailyProfile;
  }

  reset(): void {
    this.signals = [];
    this.fvgList = [];
    this.hasPosition = false;
    this.prevCandle = null;
  }

  onCandle(candle: StreamCandle): void {
    if (!this.dailyProfile || this.hasPosition) return;

    const close = quotationToNumber(candle.close);
    const time = candle.time || new Date().toISOString();

    // Поиск FVG (гэп между свечами)
    if (this.prevCandle) {
      const prevHigh = quotationToNumber(this.prevCandle.high);
      const prevLow = quotationToNumber(this.prevCandle.low);
      const curLow = quotationToNumber(candle.low);
      const curHigh = quotationToNumber(candle.high);

      if (curLow > prevHigh) {
        this.fvgList.push({ type: 'bullish', top: curLow, bottom: prevHigh, time });
      } else if (curHigh < prevLow) {
        this.fvgList.push({ type: 'bearish', top: prevLow, bottom: curHigh, time });
      }
    }
    this.prevCandle = candle;

    // Проверяем совпадение FVG с Volume Cluster (HVN)
    const hvnLevels = this.dailyProfile.hvn || [];
    for (const fvg of this.fvgList) {
      const overlap = hvnLevels.some(level => level >= fvg.bottom && level <= fvg.top);
      if (overlap) {
        if (fvg.type === 'bullish') {
          this.signals.push({
            type: 'BUY',
            price: close,
            time,
            instrumentUid: this.instrumentUid,
            reason: `Bullish FVG + Volume Cluster`,
          });
        } else {
          this.signals.push({
            type: 'SELL',
            price: close,
            time,
            instrumentUid: this.instrumentUid,
            reason: `Bearish FVG + Volume Cluster`,
          });
        }
        this.hasPosition = true;
        this.fvgList = []; // очищаем, чтобы не повторять сигнал
        break;
      }
    }
  }

  getSignals(): BacktestSignal[] { return this.signals; }
  clearSignals(): void { this.signals = []; }
  updateProfile(profile: VolumeProfileLevels): void {
    this.dailyProfile = profile;
    this.fvgList = [];
    this.prevCandle = null;
    this.hasPosition = false;
  }
}