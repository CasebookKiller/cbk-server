// @ts-nocheck
// src/backtest/backtestQueue.ts

import { HistoricalDataLoader } from './historicalDataLoader';
import { VolumeProfileEngine } from './volumeProfileEngine';
import { BacktestEngine } from './backtestEngine';
import { createStrategy } from './strategies/strategyFactory';
import { CandleInterval } from '../generated/marketdataTypes';
import SBase from '../../supabaseClient';

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
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: any;
  error?: string;
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
        market_phase: task.marketPhase || null,
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
    await this.updateTaskInSupabase(task);
    try {
      const from = new Date(task.dateFrom + 'T07:00:00Z');
      const to = new Date(task.dateTo + 'T16:00:00Z');
      const candles = await this.loader.loadIntradayCandles(
        task.instrumentUid, from, to, process.env.TReadOnly || '', task.interval
      );

      const engine = new VolumeProfileEngine({ profileResolution: 50, valueAreaPercent: 70, skipAutoSubscribe: true });
      candles.forEach(c => engine.feedCandle(c));
      const profile = engine.getProfile(task.instrumentUid);

      const strategy = createStrategy(task.strategy, task.instrumentUid, profile);
      const backtestEngine = new BacktestEngine(task.params);
      const stats = backtestEngine.run(strategy, candles);

      task.result = stats;
      task.status = 'completed';
    } catch (err: any) {
      task.status = 'failed';
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