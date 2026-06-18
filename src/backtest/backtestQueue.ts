// @ts-nocheck
// src/backtest/backtestQueue.ts

import { HistoricalDataLoader } from './historicalDataLoader';
import { VolumeProfileEngine } from './volumeProfileEngine';
import { BacktestEngine } from './backtestEngine';
import { createStrategy } from './strategies/strategyFactory';
import { CandleInterval } from '../generated/marketdataTypes';
import SBase from '../../supabaseClient';
import { VirtualPortfolio } from './virtualPortfolio';

interface Task {
  taskId: string;
  batchId?: string;
  userId?: number;
  instrumentUid: string;
  dateFrom: string;
  dateTo: string;
  interval: CandleInterval;
  strategy: string;
  params: any;
  marketPhase?: string;
  marketPhases?: string[];
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: any;
  error?: string;
}

function quotationToNumber(q: any): number {
  if (!q) return 0;
  const units = Number(q.units || 0);
  const nano = q.nano || 0;
  return units + nano / 1e9;
}

function generateParamGrid(
  sl?: [number, number, number],
  tp?: [number, number, number],
  trail?: [number, number, number],
  lots?: [number, number, number],
  risk?: [number, number, number],
  volPeriod?: [number, number, number]
): any[] {
  const grid: any[] = [];
  const slVals = sl ? range(sl[0], sl[1], sl[2]) : [undefined];
  const tpVals = tp ? range(tp[0], tp[1], tp[2]) : [undefined];
  const trailVals = trail ? range(trail[0], trail[1], trail[2]) : [undefined];
  const lotsVals = lots ? range(lots[0], lots[1], lots[2]) : [undefined];
  const riskVals = risk ? range(risk[0], risk[1], risk[2]) : [undefined];
  const volPeriodVals = volPeriod ? range(volPeriod[0], volPeriod[1], volPeriod[2]) : [undefined];

  for (const slv of slVals)
    for (const tpv of tpVals)
      for (const trv of trailVals)
        for (const lv of lotsVals)
          for (const rv of riskVals)
            for (const vp of volPeriodVals) {
              grid.push({
                stopLossPercent: slv,
                takeProfitPercent: tpv,
                trailingDistancePercent: trv,
                lots: lv,
                riskPercent: rv,
                volumeFilterEnabled: volPeriod !== undefined, // если перебираем период, значит фильтр включён
                volumeFilterPeriod: vp,
              });
            }
  return grid;
}

function range(min: number, max: number, step: number): number[] {
  if (!step || step <= 0) return [min];
  const arr = [];
  for (let v = min; v <= max + 0.0001; v += step) arr.push(Math.round(v * 100) / 100);
  return arr;
}

export class BacktestQueue {
  private tasks = new Map<string, Task>();
  private running = false;

  constructor(private loader: HistoricalDataLoader) {}

  async addTask(task: Task): Promise<void> {
    this.tasks.set(task.taskId, task);
    // Сохраняем задачу в Supabase сразу
    try {
      const { error } = await (SBase.from('backtest_tasks') as any).insert({
        task_id: task.taskId,
        batch_id: task.batchId || null,
        user_id: task.userId || null,
        instrument_uid: task.instrumentUid,
        date_from: task.dateFrom,
        date_to: task.dateTo,
        interval: task.interval,
        strategy: task.strategy,
        params: task.params,
        market_phases: task.marketPhases || null,
        status: 'pending'
      } as any);
      if (error) console.warn('Supabase insert error:', error.message);
    } catch (e) {
      console.warn('Supabase save error:', e);
    }
    this.process();
  }

  getTask(taskId: string): Task | undefined {
    return this.tasks.get(taskId);
  }

  getAllTasks(): Task[] {
    return Array.from(this.tasks.values());
  }

  private async process(): Promise<void> {
    if (this.running) return;
    this.running = true;
    for (const [, task] of this.tasks) {
      if (task.status === 'pending') {
        await this.runTask(task);
      }
    }
    this.running = false;
  }

  private async runTask(task: Task): Promise<void> {
    task.status = 'running';
    console.log('Task params:', JSON.stringify(task.params));
    await this.updateTaskInSupabase(task);
    try {
      const allSignals: any[] = [];
      const allCandles: any[] = [];
      const portfolio = new VirtualPortfolio({
        initialCapital: 100000,
        stopLossPercent: task.params.stopLossPercent || 0,
        takeProfitPercent: task.params.takeProfitPercent || 0,
        trailingDistancePercent: task.params.trailingDistancePercent || 0,
        lotQuantity: task.params.lots || 1,
        positionSizing: task.params.positionSizing || 'fixed',
        riskPercent: task.params.riskPercent || 1,
      });

      const currentDate = new Date(task.dateFrom + 'T07:00:00Z');
      const endDate = new Date(task.dateTo + 'T16:00:00Z');

      while (currentDate <= endDate) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const dayFrom = new Date(dateStr + 'T07:00:00Z');
        const dayTo = new Date(dateStr + 'T16:00:00Z');

        const candles = await this.loader.loadIntradayCandles(
          task.instrumentUid, dayFrom, dayTo, process.env.TReadOnly || '', task.interval
        );

        if (candles.length > 0) {
          const engine = new VolumeProfileEngine({
            profileResolution: 50,
            valueAreaPercent: 70,
            skipAutoSubscribe: true,
          });
          candles.forEach(c => engine.feedCandle(c));
          const profile = engine.getProfile(task.instrumentUid);
          console.log(`Profile for ${task.instrumentUid}: ${profile ? 'found (poc=' + profile.poc + ')' : 'NULL'}`);
          const strategy = createStrategy(task.strategy, task.instrumentUid, profile);
          console.log(`[DEBUG] Profile VAH=${profile?.valueAreaHigh}, VAL=${profile?.valueAreaLow}, POC=${profile?.poc}`);
          console.log(`Feeding ${candles.length} candles to strategy`);
          for (const candle of candles) {
            const high = quotationToNumber(candle.high);
            const low = quotationToNumber(candle.low);
            if (high > profile?.valueAreaHigh || low < profile?.valueAreaLow) {
              console.log(`[DEBUG] Breakout detected: high=${high} > VAH=${profile?.valueAreaHigh} or low=${low} < VAL=${profile?.valueAreaLow}`);
            }
            strategy.onCandle(candle);
            const newSignals = strategy.getSignals();
            for (const signal of newSignals) {
              console.log(`Signal: ${signal.type} at ${signal.price}`);
              portfolio.processSignal(signal);
              allSignals.push(signal);
            }
            strategy.clearSignals();

            const high = quotationToNumber(candle.high);
            const low = quotationToNumber(candle.low);
            const close = quotationToNumber(candle.close);
            portfolio.checkStopTake(high, low, close, candle.time || '');
          }

          allCandles.push(...candles);
        }

        currentDate.setDate(currentDate.getDate() + 1);
      }

      if (allCandles.length > 0) {
        const lastCandle = allCandles[allCandles.length - 1];
        const lastPrice = quotationToNumber(lastCandle.close);
        portfolio.finalizeWithLastPrice(lastPrice, lastCandle.time || '');
      } else {
        portfolio.finalizeWithLastPrice(0, '');
      }

      const stats = portfolio.getStats();
      const backtestStats = {
        totalSignals: allSignals.length,
        buySignals: allSignals.filter(s => s.type === 'BUY').length,
        sellSignals: allSignals.filter(s => s.type === 'SELL').length,
        portfolio: stats,
      };

      task.result = backtestStats;
      task.status = 'completed';
    } catch (err: any) {
      task.status = 'failed';
      console.error('Backtest failed:', err);
      task.error = err.message;
    }
    await this.updateTaskInSupabase(task);

    if (task.batchId) {
      await this.checkAndUpdateBatch(task.batchId);
    }
  }

  private async checkAndUpdateBatch(batchId: string): Promise<void> {
    try {
      const { data: tasks, error } = await (SBase.from('backtest_tasks') as any)
        .select('status')
        .eq('batch_id', batchId);

      if (error || !tasks) return;

      const allCompleted = tasks.every((t: any) => t.status === 'completed' || t.status === 'failed');
      if (allCompleted) {
        const hasFailed = tasks.some((t: any) => t.status === 'failed');
        const newStatus = hasFailed ? 'failed' : 'completed';
        await (SBase.from('backtest_batches') as any)
          .update({ status: newStatus })
          .eq('id', batchId);
      }
    } catch (e) {
      console.warn('checkAndUpdateBatch error:', e);
    }
  }

  private async updateTaskInSupabase(task: Task): Promise<void> {
    try {
      const { error } = await (SBase.from('backtest_tasks') as any)
        .update({
          status: task.status,
          result: task.result || null,
          error: task.error || null,
        })
        .eq('task_id', task.taskId);
      if (error) console.warn('Supabase update error:', error.message);
    } catch (e) {
      console.warn('Supabase update error:', e);
    }
  }
}