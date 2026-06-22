import { HistoricalDataLoader } from './historicalDataLoader';
import { VolumeProfileEngine } from './volumeProfileEngine';
import SBase from '../../supabaseClient';
import fs from 'fs-extra';
import path from 'path';
import { CandleInterval } from '../generated/marketdataTypes';

const INTERVAL_MAP: Record<string, CandleInterval> = {
  'CANDLE_INTERVAL_1_MIN': CandleInterval.CANDLE_INTERVAL_1_MIN,
  'CANDLE_INTERVAL_5_MIN': CandleInterval.CANDLE_INTERVAL_5_MIN,
  'CANDLE_INTERVAL_HOUR': CandleInterval.CANDLE_INTERVAL_HOUR,
};

const PHASE_CACHE_DIR = '/opt/cbk-server/phase_cache';

/** Детектор фазы по методу Trader Dale (использует VWAP, VA, всплески объёма) */
function detectDayPhase(candles: any[], profile: any): string {
  if (!profile || !profile.poc || profile.poc <= 0 || candles.length < 5) return 'CHOP';

  const totalVolume = candles.reduce((s, c) => s + Number(c.volume || 0), 0);
  if (totalVolume === 0) return 'CHOP';

  // VWAP
  const vwap = candles.reduce((s, c) => s + (Number(c.high) + Number(c.low) + Number(c.close)) / 3 * Number(c.volume), 0) / totalVolume;

  // Процент внутри VA
  const insideVA = candles.filter(c => {
    const close = Number(c.close || 0);
    return close >= profile.valueAreaLow && close <= profile.valueAreaHigh;
  }).length;
  const percentInside = (insideVA / candles.length) * 100;

  const last = candles[candles.length - 1];
  const high = Number(last.high || 0);
  const low = Number(last.low || 0);
  const close = Number(last.close || 0);
  const avgVol = totalVolume / candles.length;
  const spike = Number(last.volume) > avgVol * 1.5;
  const vaWidth = ((profile.valueAreaHigh - profile.valueAreaLow) / profile.poc) * 100;

  // Тренд по VWAP
  let vwapTrend = 0;
  if (vwap > 0) {
    vwapTrend = ((close - vwap) / vwap) * 100;
  }

  // Определение фазы
  if (vaWidth < 5.0 && percentInside > 50) return 'BALANCE';
  if (vaWidth > 4.0 && spike && (high > profile.valueAreaHigh || low < profile.valueAreaLow)) return 'BREAKOUT';
  if (vwapTrend > 0.5 && close > profile.valueAreaHigh) return 'TREND_UP';
  if (vwapTrend < -0.5 && close < profile.valueAreaLow) return 'TREND_DOWN';
  console.log(`[PhaseDebug] ${candles[0]?.time} VWAP=${vwap.toFixed(2)} %inside=${percentInside.toFixed(1)} width=${vaWidth.toFixed(1)} trend=${vwapTrend.toFixed(2)} spike=${spike}`);
  return 'CHOP';
}

export class PhaseWorker {
  private loader = new HistoricalDataLoader();

  async processTask(taskId: string, instrumentUid: string, dateFrom: string, dateTo: string, interval: string) {
    await fs.ensureDir(PHASE_CACHE_DIR);
    const days: string[] = [];
    const cur = new Date(dateFrom + 'T00:00:00Z');
    const end = new Date(dateTo + 'T00:00:00Z');

    while (cur <= end) {
      const dateStr = cur.toISOString().split('T')[0];
      const phase = await this.getPhaseForDay(instrumentUid, dateStr, interval);
      days.push(phase);
      cur.setDate(cur.getDate() + 1);
    }

    const { error } = await (SBase.from('backtest_tasks') as any)
      .update({ market_phases: days, phase_status: 'completed' })
      .eq('task_id', taskId);

    if (error) {
      console.error(`[PhaseWorker] Failed to update task ${taskId}:`, error);
    } else {
      console.log(`[PhaseWorker] Task ${taskId} updated (${days.length} phases)`);
    }
  }

  private async getPhaseForDay(uid: string, dateStr: string, interval: string): Promise<string> {
    const cacheFile = path.join(PHASE_CACHE_DIR, `${uid}_${dateStr}.json`);
    try {
      if (await fs.pathExists(cacheFile)) {
        const raw = await fs.readFile(cacheFile, 'utf-8');
        const data = JSON.parse(raw);
        return data.phase;
      }
    } catch (e) {
      console.warn(`[PhaseWorker] Cache read error for ${dateStr}`, e);
    }

    const dayStart = new Date(dateStr + 'T07:00:00Z');
    const dayEnd = new Date(dateStr + 'T16:00:00Z');
    const intervalEnum = INTERVAL_MAP[interval] || CandleInterval.CANDLE_INTERVAL_1_MIN;
    const candles = await this.loader.loadIntradayCandles(
      uid, dayStart, dayEnd, process.env.TReadOnly || '', intervalEnum
    );

    // Строим профиль для определения Value Area
    const engine = new VolumeProfileEngine({
      profileResolution: 50,
      valueAreaPercent: 70,
      skipAutoSubscribe: true,
    });
    candles.forEach(c => engine.feedCandle(c));
    const profile = engine.getProfile(uid);

    console.log(`[PhaseDebug] ${dateStr} candles count: ${candles.length}`);
    const phase = detectDayPhase(candles, profile);

    try {
      await fs.writeFile(cacheFile, JSON.stringify({ phase, date: dateStr }), 'utf-8');
    } catch (e) {
      console.warn(`[PhaseWorker] Cache write error for ${dateStr}`, e);
    }
    return phase;
  }

  async processPendingTasks() {
    try {
      const { data: tasks } = await (SBase
        .from('backtest_tasks') as any)
        .select('task_id, instrument_uid, date_from, date_to, interval')
        .eq('phase_status', 'pending')
        .limit(1);

      if (tasks && tasks.length > 0) {
        const t = tasks[0];
        console.log(`[PhaseWorker] Processing task ${t.task_id}`);
        await this.processTask(t.task_id, t.instrument_uid, t.date_from, t.date_to, t.interval);
      }
    } catch (err) {
      console.error('[PhaseWorker] Error in processPendingTasks:', err);
    }
  }
}