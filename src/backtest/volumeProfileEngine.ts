// src/main/services/volumeProfileEngine.ts
import { EventEmitter } from 'events';
import type { StreamCandle, Quotation } from './types';
import { StreamTrade } from '@/generated/tbank/marketdataStreamTypes';


// Вспомогательная функция: Quotation → число
function quotationToNumber(q?: Quotation): number {
  if (!q) return 0;
  const units = Number(q.units || '0');
  const nano = q.nano || 0;
  return units + nano / 1e9;
}

export interface VolumeProfileLevels {
  instrumentUid: string;
  timestamp: string;       // время свечи, для которой рассчитан профиль
  poc: number;             // цена Point of Control
  valueAreaHigh: number;   // верхняя граница Value Area (70%)
  valueAreaLow: number;    // нижняя граница Value Area (70%)
  hvn: number[];           // High Volume Nodes (цены с объёмом > 1.5 * среднего)
  lvn: number[];           // Low Volume Nodes (цены с объёмом < 0.5 * среднего)
  totalVolume: number;     // суммарный объём за период
  volumeByPrice: Array<{ price: number; volume: number }>; // <-- новое поле
}

export interface Signal {
  instrumentUid: string;
  time: string;
  type: 'POC_BREAKOUT_UP' | 'POC_BREAKOUT_DOWN' | 'VA_RETURN_UP' | 'VA_RETURN_DOWN' | 'HVN_BOUNCE' | 'LVN_BREAKOUT';
  price: number;
  level: number;
  message: string;
}

// Конфигурация стратегии
export interface VolumeProfileConfig {
  valueAreaPercent: number;   // обычно 70
  hvnMultiplier: number;      // множитель для определения HVN (по умолчанию 1.5)
  lvnMultiplier: number;      // множитель для определения LVN (по умолчанию 0.5)
  minVolumeThreshold: number; // минимальный объём для учёта уровня
  profileResolution: number;   // <-- новое поле (по умолчанию 50)
  skipAutoSubscribe?: boolean;
}

const DEFAULT_CONFIG: VolumeProfileConfig = {
  valueAreaPercent: 70,
  hvnMultiplier: 1.5,
  lvnMultiplier: 0.5,
  minVolumeThreshold: 100,
  profileResolution: 50
};

function normalDensity(x: number, mean: number, stdDev: number): number {
  const exponent = -0.5 * Math.pow((x - mean) / stdDev, 2);
  return (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
}

export class VolumeProfileEngine extends EventEmitter {
  private config: VolumeProfileConfig;
  // Хранилище накопленных объёмов: instrumentUid → карта (цена → объём)
  private volumeByPrice: Map<string, Map<number, number>> = new Map();
  // Последняя известная цена для инструмента (для генерации сигналов)
  private lastPrice: Map<string, number> = new Map();
  // Время последней обработанной свечи
  private lastCandleTime: Map<string, string> = new Map();
  private lastSignalDirection: Map<string, string> = new Map(); // <-- НОВОЕ


  constructor(config: Partial<VolumeProfileConfig> = {}) {
    super();
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /*
  private onCandle(candle: StreamCandle): void {
    const uid = candle.instrumentUid || candle.figi;
    if (!uid) return;

    const volume = Number(candle.volume || '0');
    if (volume <= this.config.minVolumeThreshold) return;

    const high = quotationToNumber(candle.high);
    const low = quotationToNumber(candle.low);
    const close = quotationToNumber(candle.close);
    const time = candle.time || new Date().toISOString();

    // Обновляем последнюю цену
    this.lastPrice.set(uid, close);

    // Простейший способ распределения объёма по уровням:
    // считаем, что объём равномерно распределён между high и low с шагом 1 (можно улучшить)
    const priceRange = high - low;
    if (priceRange <= 0) {
      // Если свеча нулевая, приписываем весь объём к цене close
      this.addVolume(uid, close, volume);
    } else {
      const levels = Math.round(priceRange);
      if (levels === 0) {
        this.addVolume(uid, close, volume);
      } else {
        const volumePerLevel = volume / levels;
        for (let price = low; price <= high; price++) {
          this.addVolume(uid, price, volumePerLevel);
        }
      }
    }

    // Проверяем, закрылась ли свеча (упрощённо: считаем, что каждая свеча — это окончание периода)
    // В реальном стриме свечи приходят уже готовыми (по closed), поэтому сразу пересчитываем профиль
    this.recalculateProfileWithCache(uid, time);

    // Генерация сигналов на основе последней цены и новых уровней
    this.generateSignals(uid, close, time);
  }*/

  private onCandle(candle: StreamCandle): void {
    const uid = candle.instrumentUid;
    if (!uid) return;

    const volume = Number(candle.volume || '0');
    if (volume <= this.config.minVolumeThreshold) return;

    const high = quotationToNumber(candle.high);
    const low = quotationToNumber(candle.low);
    const close = quotationToNumber(candle.close);
    const time = candle.time || new Date().toISOString();

    this.lastPrice.set(uid, close);

    const typicalPrice = (high + low + close) / 3;
    const range = high - low;

    if (range <= 0.001) {
      // Нулевой диапазон – весь объём в цену close
      this.addVolume(uid, close, volume);
    } else {
      const resolution = this.config.profileResolution; // число шагов
      const spreadFactor = 0.15;  // можно вынести в конфиг
      const stdDev = range * spreadFactor;
      
      const densities: number[] = [];
      const prices: number[] = [];
      
      for (let i = 0; i < resolution; i++) {
        const price = low + (i / (resolution - 1)) * range;
        const density = normalDensity(price, typicalPrice, stdDev);
        densities.push(density);
        prices.push(price);
      }
      
      const sumDensity = densities.reduce((a, b) => a + b, 0);
      if (sumDensity > 0) {
        for (let i = 0; i < resolution; i++) {
          const weight = densities[i] / sumDensity;
          this.addVolume(uid, prices[i], volume * weight);
        }
      } else {
        // Fallback
        this.addVolume(uid, close, volume);
      }
    }

    this.recalculateProfileWithCache(uid, time);
    this.generateSignals(uid, close, time);
  }

  private onTrade(trade: StreamTrade): void {
    // Можно использовать трейды для более точного тикового профиля
    // Пока оставим заглушку: обновляем lastPrice, но не накапливаем объём (чтобы не смешивать со свечами)
    const uid = trade.instrumentUid || trade.figi;
    if (!uid) return;
    const price = quotationToNumber(trade.price);
    this.lastPrice.set(uid, price);
    // При необходимости можно добавить точное накопление объёма по трейдам
  }

  private addVolume(uid: string, price: number, volume: number): void {
    if (!this.volumeByPrice.has(uid)) {
      this.volumeByPrice.set(uid, new Map());
    }
    const priceMap = this.volumeByPrice.get(uid)!;
    const roundedPrice = Math.round(price * 100) / 100; // округляем до копеек
    priceMap.set(roundedPrice, (priceMap.get(roundedPrice) || 0) + volume);
  }

  private recalculateProfile(uid: string, timestamp: string): void {
    const priceMap = this.volumeByPrice.get(uid);
    if (!priceMap || priceMap.size === 0) return;

    // Сортируем цены
    const sortedEntries = Array.from(priceMap.entries()).sort((a, b) => a[0] - b[0]);

    const totalVolume = sortedEntries.reduce((sum, [, vol]) => sum + vol, 0);
    if (totalVolume === 0) return;

    // POC – цена с максимальным объёмом
    let poc = sortedEntries[0][0];
    let maxVol = sortedEntries[0][1];
    for (const [price, vol] of sortedEntries) {
      if (vol > maxVol) {
        maxVol = vol;
        poc = price;
      }
    }

    // Value Area
    const targetVolume = (this.config.valueAreaPercent / 100) * totalVolume;
    let accumulated = 0;
    let vaHigh = poc;
    let vaLow = poc;

    // Начинаем от POC и расширяемся, пока не наберём targetVolume
    let pocIndex = sortedEntries.findIndex(([p]) => p === poc);
    if (pocIndex === -1) pocIndex = 0;

    let left = pocIndex;
    let right = pocIndex;
    accumulated += sortedEntries[pocIndex][1];

    while (accumulated < targetVolume && (left > 0 || right < sortedEntries.length - 1)) {
      // Смотрим, где больше объём – слева или справа
      let leftVol = left > 0 ? sortedEntries[left - 1][1] : 0;
      let rightVol = right < sortedEntries.length - 1 ? sortedEntries[right + 1][1] : 0;

      if (leftVol >= rightVol && left > 0) {
        left--;
        accumulated += sortedEntries[left][1];
        vaLow = sortedEntries[left][0];
      } else if (right < sortedEntries.length - 1) {
        right++;
        accumulated += sortedEntries[right][1];
        vaHigh = sortedEntries[right][0];
      } else if (left > 0) {
        left--;
        accumulated += sortedEntries[left][1];
        vaLow = sortedEntries[left][0];
      } else {
        break;
      }
    }

    // Средний объём для HVN/LVN
    const avgVolume = totalVolume / sortedEntries.length;
    const hvn: number[] = [];
    const lvn: number[] = [];
    for (const [price, vol] of sortedEntries) {
      if (vol > avgVolume * this.config.hvnMultiplier) hvn.push(price);
      else if (vol < avgVolume * this.config.lvnMultiplier && vol > 0) lvn.push(price);
    }

    // сохраняем карту объёмов для отображения
    const volumeByPrice = Array.from(priceMap.entries()).map(([price, vol]) => ({
      price,
      volume: vol,
    }));

    const levels: VolumeProfileLevels = {
      instrumentUid: uid,
      timestamp,
      poc,
      valueAreaHigh: vaHigh,
      valueAreaLow: vaLow,
      hvn,
      lvn,
      totalVolume,
      volumeByPrice: volumeByPrice,
    };

    // Сохраняем во внутреннем хранилище и уведомляем подписчиков
    this.emit('profileUpdate', levels);
  }

/*
    private generateSignals(uid: string, currentPrice: number, time: string): void {
    // Здесь будем проверять простейшие сценарии на основе последнего рассчитанного профиля
    const priceMap = this.volumeByPrice.get(uid);
    if (!priceMap) return;

    // Берём последние уровни (можно сохранять их явно, но для простоты пересчитаем на лету)
    // В реальной реализации лучше сохранять последний профиль в поле класса
    // Пока сделаем заглушку-пример
    const profile = this.getLastProfile(uid);
    if (!profile) return;

    const { poc, valueAreaHigh, valueAreaLow, hvn, lvn } = profile;

    // Сигнал пробоя POC
    if (currentPrice > poc) {
      this.emitSignal(uid, time, 'POC_BREAKOUT_UP', currentPrice, poc, `Цена ${currentPrice} пробила POC ${poc} вверх`);
    } else if (currentPrice < poc) {
      this.emitSignal(uid, time, 'POC_BREAKOUT_DOWN', currentPrice, poc, `Цена ${currentPrice} пробила POC ${poc} вниз`);
    }

    // Возврат в Value Area
    if (currentPrice > valueAreaLow && currentPrice < valueAreaHigh) {
      // Проверим, не вышла ли цена до этого за пределы VA (упрощённо)
    }

    // Для HVN/LVN можно добавлять по мере реализации
  }
*/

  private generateSignals(uid: string, currentPrice: number, time: string): void {
    // Здесь будем проверять простейшие сценарии на основе последнего рассчитанного профиля
    const priceMap = this.volumeByPrice.get(uid);
    if (!priceMap) return;

    // Берём последние уровни (можно сохранять их явно, но для простоты пересчитаем на лету)
    // В реальной реализации лучше сохранять последний профиль в поле класса
    // Пока сделаем заглушку-пример
    const profile = this.getLastProfile(uid);
    if (!profile) return;

    const { poc, valueAreaHigh, valueAreaLow, hvn, lvn } = profile;

    // Определяем текущее направление пробоя
    const newDirection = currentPrice > poc ? 'UP' : (currentPrice < poc ? 'DOWN' : null);
    if (!newDirection) return; // цена равна POC – сигнала нет

    // Проверяем, не отправляли ли мы уже сигнал в этом же направлении
    const lastDir = this.lastSignalDirection.get(uid);
    if (lastDir === newDirection) {
      return; // повторный сигнал в ту же сторону – игнорируем
    }

    // Сохраняем новое направление и отправляем сигнал
    this.lastSignalDirection.set(uid, newDirection);

    if (newDirection === 'UP') {
      this.emitSignal(uid, time, 'POC_BREAKOUT_UP', currentPrice, poc, `Цена ${currentPrice} пробила POC ${poc} вверх`);
    } else {
      this.emitSignal(uid, time, 'POC_BREAKOUT_DOWN', currentPrice, poc, `Цена ${currentPrice} пробила POC ${poc} вниз`);
    }

    // Возврат в Value Area
    if (currentPrice > valueAreaLow && currentPrice < valueAreaHigh) {
      // Проверим, не вышла ли цена до этого за пределы VA (упрощённо)
    }

    // Для HVN/LVN можно добавлять по мере реализации
  }

  private emitSignal(uid: string, time: string, type: Signal['type'], price: number, level: number, message: string): void {
    const signal: Signal = { instrumentUid: uid, time, type, price, level, message };
    this.emit('signal', signal);
  }

  // Получить последний профиль (можно хранить в Map)
  private profileCache: Map<string, VolumeProfileLevels> = new Map();

  /** Получить последний рассчитанный профиль для инструмента */
  public getProfile(instrumentUid: string): VolumeProfileLevels | null {
    return this.profileCache.get(instrumentUid) || null;
  }

  private getLastProfile(uid: string): VolumeProfileLevels | undefined {
    return this.profileCache.get(uid);
  }

  public reset(instrumentUid: string): void {
    this.volumeByPrice.delete(instrumentUid);
    this.lastSignalDirection.delete(instrumentUid);
    this.profileCache.delete(instrumentUid);
  }

  // При расчёте профиля сохраняем в кеш
  private cacheProfile(profile: VolumeProfileLevels): void {
    this.profileCache.set(profile.instrumentUid, profile);
  }

  // Переопределим recalculateProfile, чтобы сохранять профиль
  private recalculateProfileWithCache(uid: string, timestamp: string): void {
    const priceMap = this.volumeByPrice.get(uid);
    if (!priceMap || priceMap.size === 0) return;

    const sortedEntries = Array.from(priceMap.entries()).sort((a, b) => a[0] - b[0]);
    const totalVolume = sortedEntries.reduce((sum, [, vol]) => sum + vol, 0);
    if (totalVolume === 0) return;

    let poc = sortedEntries[0][0];
    let maxVol = sortedEntries[0][1];
    for (const [price, vol] of sortedEntries) {
      if (vol > maxVol) {
        maxVol = vol;
        poc = price;
      }
    }

    const targetVolume = (this.config.valueAreaPercent / 100) * totalVolume;
    let accumulated = 0;
    let vaHigh = poc;
    let vaLow = poc;
    let pocIndex = sortedEntries.findIndex(([p]) => p === poc);
    if (pocIndex === -1) pocIndex = 0;
    let left = pocIndex;
    let right = pocIndex;
    accumulated += sortedEntries[pocIndex][1];

    while (accumulated < targetVolume && (left > 0 || right < sortedEntries.length - 1)) {
      const leftVol = left > 0 ? sortedEntries[left - 1][1] : 0;
      const rightVol = right < sortedEntries.length - 1 ? sortedEntries[right + 1][1] : 0;
      if (leftVol >= rightVol && left > 0) {
        left--;
        accumulated += sortedEntries[left][1];
        vaLow = sortedEntries[left][0];
      } else if (right < sortedEntries.length - 1) {
        right++;
        accumulated += sortedEntries[right][1];
        vaHigh = sortedEntries[right][0];
      } else if (left > 0) {
        left--;
        accumulated += sortedEntries[left][1];
        vaLow = sortedEntries[left][0];
      } else break;
    }

    const avgVolume = totalVolume / sortedEntries.length;
    const hvn = sortedEntries.filter(([, vol]) => vol > avgVolume * this.config.hvnMultiplier).map(([p]) => p);
    const lvn = sortedEntries.filter(([, vol]) => vol < avgVolume * this.config.lvnMultiplier && vol > 0).map(([p]) => p);

    const volumeByPrice = Array.from(priceMap.entries()).map(([price, vol]) => ({
      price,
      volume: vol,
    }));

    const profile: VolumeProfileLevels = {
      instrumentUid: uid,
      timestamp,
      poc,
      valueAreaHigh: vaHigh,
      valueAreaLow: vaLow,
      hvn,
      lvn,
      totalVolume,
      volumeByPrice,   // <-- включаем
    };

    this.cacheProfile(profile);
    this.emit('profileUpdate', profile);
  }

  // Замена метода recalculateProfile на новый (можно просто переименовать)
  private onCandleWithCache(candle: StreamCandle): void {
    // ... (копия onCandle, но вместо recalculateProfile вызываем recalculateProfileWithCache)
  }

  // Позволяет подать свечу вручную (для построения профиля без стрима).
  // Используется скринером и бэктестером.
  public feedCandle(candle: StreamCandle): void {
    // вызываем существующую приватную логику
    this.onCandle(candle);
  }
}
