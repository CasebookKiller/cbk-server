// src/main/services/backtest/strategies/TrendStrategy.ts
import type { StreamCandle } from '../../../generated/marketdataStreamTypes';
import type { VolumeProfileLevels } from '../../../../volumeProfileEngine';
import type { IBacktestStrategy } from '../backtestEngine';
import { quotationToNumber, BacktestSignal } from '../common';

export class TrendStrategy implements IBacktestStrategy {
  private signals: BacktestSignal[] = [];
  private dailyProfile: VolumeProfileLevels | null = null;
  private instrumentUid: string;

  // Состояния для отслеживания пробоев и ретестов
  private hvnLevel: number | null = null;        // текущий отслеживаемый уровень HVN
  private hvnBroken = false;                     // был ли пробой уровня
  private trendDirection: 'UP' | 'DOWN' | null = null;

  private hasPosition = false;
  private lastTradeTime = 0;
  private minIntervalMs = 15 * 60 * 1000; // 15 минут

  private volumeFilterEnabled: boolean;
  private volumeFilterPeriod: number;
  private volumeHistory: number[] = [];

  constructor(
    instrumentUid: string,
    dailyProfile: VolumeProfileLevels | null,   // ← добавлено | null
    options?: { volumeFilterEnabled?: boolean; volumeFilterPeriod?: number }
  ) {
    this.instrumentUid = instrumentUid;
    this.dailyProfile = dailyProfile;
    this.volumeFilterEnabled = options?.volumeFilterEnabled ?? false;
    this.volumeFilterPeriod = options?.volumeFilterPeriod ?? 20;
  }

  reset(): void {
    this.signals = [];
    this.hvnLevel = null;
    this.hvnBroken = false;
    this.trendDirection = null;
    this.hasPosition = false;
    this.lastTradeTime = 0;
    this.volumeHistory = [];
  }

  onCandle(candle: StreamCandle): void {
    if (!this.dailyProfile || this.hasPosition) return; // ← ВОТ ЭТА СТРОКА

    const high = quotationToNumber(candle.high);
    const low = quotationToNumber(candle.low);
    const close = quotationToNumber(candle.close);
    const time = candle.time || new Date().toISOString();
    
    // Сохраняем объём текущей свечи
    const volume = Number(candle.volume || '0');
    this.volumeHistory.push(volume);
    if (this.volumeHistory.length > this.volumeFilterPeriod) {
      this.volumeHistory.shift();
    }

    // Проверка фильтра по объёму
    if (this.volumeFilterEnabled && this.volumeHistory.length >= this.volumeFilterPeriod) {
      const avgVolume = this.volumeHistory.reduce((a, b) => a + b, 0) / this.volumeHistory.length;
      if (volume < avgVolume) {
        return; // объём ниже среднего – игнорируем сигнал
      }
    }

    // Кулдаун между сделками (дополнительная защита)
    const now = new Date(time).getTime();
    if (now - this.lastTradeTime < this.minIntervalMs) return;

    // Определяем тренд
    if (close > this.dailyProfile.valueAreaHigh) {
      this.trendDirection = 'UP';
    } else if (close < this.dailyProfile.valueAreaLow) {
      this.trendDirection = 'DOWN';
    } else {
      // Внутри VA – тренд не определён, сбрасываем
      this.hvnLevel = null;
      this.hvnBroken = false;
      return;
    }

    // Выбор ближайшей HVN
    if (this.hvnLevel === null && this.dailyProfile.hvn.length > 0) {
      const hvnList = this.dailyProfile.hvn;
      if (this.trendDirection === 'UP') {
        const candidates = hvnList.filter(level => level < close);
        if (candidates.length > 0) this.hvnLevel = Math.max(...candidates);
      } else {
        const candidates = hvnList.filter(level => level > close);
        if (candidates.length > 0) this.hvnLevel = Math.min(...candidates);
      }
    }

    if (this.hvnLevel === null) return;

    // Проверка пробоя
    if (!this.hvnBroken) {
      if (this.trendDirection === 'UP' && high > this.hvnLevel) {
        this.hvnBroken = true;
      } else if (this.trendDirection === 'DOWN' && low < this.hvnLevel) {
        this.hvnBroken = true;
      }
    }

    // Ретест и генерация сигнала
    if (this.hvnBroken) {
      const tolerance = 0.05;
      if (this.trendDirection === 'UP' && close <= this.hvnLevel + tolerance && close >= this.hvnLevel - tolerance) {
        this.signals.push({
          type: 'BUY',
          price: close,
          time,
          instrumentUid: this.instrumentUid,
          reason: `Тренд вверх, ретест HVN ${this.hvnLevel}`,
        });
        this.hasPosition = true;          // ← блокируем дальнейшие входы
        this.lastTradeTime = now;         // ← обновляем время последней сделки
        this.hvnLevel = null;
        this.hvnBroken = false;
      } else if (this.trendDirection === 'DOWN' && close >= this.hvnLevel - tolerance && close <= this.hvnLevel + tolerance) {
        this.signals.push({
          type: 'SELL',
          price: close,
          time,
          instrumentUid: this.instrumentUid,
          reason: `Тренд вниз, ретест HVN ${this.hvnLevel}`,
        });
        this.hasPosition = true;
        this.lastTradeTime = now;
        this.hvnLevel = null;
        this.hvnBroken = false;
      }
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
    this.hasPosition = false;
    this.hvnLevel = null;
    this.hvnBroken = false;
    this.trendDirection = null;
    this.volumeHistory = [];
  }
}