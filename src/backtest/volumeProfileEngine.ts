// /opt/cbk-server/src/backtest/volumeProfileEngine.ts
import { EventEmitter } from 'events';

export interface VolumeProfileLevels {
  instrumentUid: string;
  timestamp: string;
  poc: number;
  valueAreaHigh: number;
  valueAreaLow: number;
  hvn: number[];
  lvn: number[];
  totalVolume: number;
  volumeByPrice: Array<{ price: number; volume: number }>;
}

export interface VolumeProfileConfig {
  valueAreaPercent: number;
  hvnMultiplier: number;
  lvnMultiplier: number;
  minVolumeThreshold: number;
  profileResolution: number;
  skipAutoSubscribe?: boolean;
}

const DEFAULT_CONFIG: VolumeProfileConfig = {
  valueAreaPercent: 70,
  hvnMultiplier: 1.5,
  lvnMultiplier: 0.5,
  minVolumeThreshold: 100,
  profileResolution: 50,
};

function normalDensity(x: number, mean: number, stdDev: number): number {
  const exponent = -0.5 * Math.pow((x - mean) / stdDev, 2);
  return (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
}

export class VolumeProfileEngine extends EventEmitter {
  private config: VolumeProfileConfig;
  private volumeByPrice = new Map<string, Map<number, number>>();
  private lastPrice = new Map<string, number>();
  private profileCache = new Map<string, VolumeProfileLevels>();

  constructor(config: Partial<VolumeProfileConfig> = {}) {
    super();
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /** Подать свечу с числовыми полями */
  public feedCandle(candle: { instrumentUid: string; high: number; low: number; close: number; volume: string | number; time: string }): void {
    const uid = candle.instrumentUid;
    if (!uid) return;

    const volume = Number(candle.volume || 0);
    if (volume <= this.config.minVolumeThreshold) return;

    const high = Number(candle.high);
    const low = Number(candle.low);
    const close = Number(candle.close);
    const time = candle.time || new Date().toISOString();

    this.lastPrice.set(uid, close);

    const typicalPrice = (high + low + close) / 3;
    const range = high - low;

    if (range <= 0.001) {
      this.addVolume(uid, close, volume);
    } else {
      const resolution = this.config.profileResolution;
      const spreadFactor = 0.15;
      const stdDev = range * spreadFactor;

      let sumDensity = 0;
      const prices: number[] = [];
      const densities: number[] = [];

      for (let i = 0; i < resolution; i++) {
        const price = low + (i / (resolution - 1)) * range;
        const density = normalDensity(price, typicalPrice, stdDev);
        prices.push(price);
        densities.push(density);
        sumDensity += density;
      }

      if (sumDensity > 0) {
        for (let i = 0; i < resolution; i++) {
          const weight = densities[i] / sumDensity;
          this.addVolume(uid, prices[i], volume * weight);
        }
      } else {
        this.addVolume(uid, close, volume);
      }
    }

    this.recalculateProfileWithCache(uid, time);
  }

  private addVolume(uid: string, price: number, volume: number): void {
    if (!this.volumeByPrice.has(uid)) {
      this.volumeByPrice.set(uid, new Map());
    }
    const priceMap = this.volumeByPrice.get(uid)!;
    const roundedPrice = Math.round(price * 100) / 100;
    priceMap.set(roundedPrice, (priceMap.get(roundedPrice) || 0) + volume);
  }

  private recalculateProfileWithCache(uid: string, timestamp: string): void {
    const priceMap = this.volumeByPrice.get(uid);
    if (!priceMap || priceMap.size === 0) return;

    const sortedEntries = Array.from(priceMap.entries()).sort((a, b) => a[0] - b[0]);
    const totalVolume = sortedEntries.reduce((sum, [, vol]) => sum + vol, 0);
    if (totalVolume === 0) return;

    let poc = sortedEntries[0][0];
    let maxVol = sortedEntries[0][1];
    for (const [price, vol] of sortedEntries) {
      if (vol > maxVol) { maxVol = vol; poc = price; }
    }

    const targetVolume = (this.config.valueAreaPercent / 100) * totalVolume;
    let accumulated = 0;
    let vaHigh = poc, vaLow = poc;
    let pocIndex = sortedEntries.findIndex(([p]) => p === poc);
    if (pocIndex === -1) pocIndex = 0;
    let left = pocIndex, right = pocIndex;
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

    const volumeByPrice = Array.from(priceMap.entries()).map(([price, vol]) => ({ price, volume: vol }));

    const profile: VolumeProfileLevels = {
      instrumentUid: uid,
      timestamp,
      poc,
      valueAreaHigh: vaHigh,
      valueAreaLow: vaLow,
      hvn,
      lvn,
      totalVolume,
      volumeByPrice,
    };

    this.profileCache.set(uid, profile);
    this.emit('profileUpdate', profile);
  }

  public getProfile(instrumentUid: string): VolumeProfileLevels | null {
    return this.profileCache.get(instrumentUid) || null;
  }

  public reset(instrumentUid: string): void {
    this.volumeByPrice.delete(instrumentUid);
    this.profileCache.delete(instrumentUid);
  }
}