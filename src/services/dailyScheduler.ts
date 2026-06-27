// @ts-nocheck
// src/services/dailyScheduler.ts

import SBase from '../../supabaseClient';
import { BacktestQueue } from '../backtest/backtestQueue';

interface SchedulerTask {
  id: string;
  userId?: number;
  time: string;
  instruments: string[];
  dateFrom: string;
  dateTo: string;
  interval: string;
  strategy: string;
  params: any;
  useGrid?: boolean;
  gridConfig?: any;
  useVolumeFilter?: boolean;
  volumeFilterConfig?: any;
  enabled: boolean;
  lastRun: string | null;
  nextRun: string | null;
  lastBatchId?: string | null;
}

export class DailyScheduler {
  private tasks: SchedulerTask[] = [];
  private timer: NodeJS.Timeout | null = null;
  private backtestQueue: BacktestQueue;

  constructor(backtestQueue: BacktestQueue) {
    this.backtestQueue = backtestQueue;
  }

  async start(): Promise<void> {
    await this.loadTasksFromDB();
    this.scheduleNextTick();
    console.log('[DailyScheduler] Started with', this.tasks.length, 'tasks');
  }

  private async loadTasksFromDB(): Promise<void> {
    try {
      const { data, error } = await SBase
        .from('scheduler_tasks')
        .select('*')
        .eq('enabled', true);
      if (error) {
        console.error('[DailyScheduler] Failed to load tasks from DB:', error);
        return;
      }
      this.tasks = (data || []).map((t: any) => ({
        id: t.id,
        userId: t.user_id,
        time: t.time,
        instruments: t.instruments,
        dateFrom: t.date_from,
        dateTo: t.date_to,
        interval: t.interval,
        strategy: t.strategy,
        params: t.params,
        useGrid: t.use_grid || false,
        gridConfig: t.grid_config || null,
        useVolumeFilter: t.use_volume_filter || false,
        volumeFilterConfig: t.volume_filter_config || null,
        enabled: t.enabled,
        lastRun: t.last_run,
        nextRun: t.next_run,
        lastBatchId: t.last_batch_id || null,
      }));
    } catch (err) {
      console.error('[DailyScheduler] Error loading tasks:', err);
    }
  }

  async addTask(task: Omit<SchedulerTask, 'id' | 'enabled' | 'lastRun' | 'nextRun'>): Promise<SchedulerTask> {
    const id = `sched_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const now = new Date();
    // Вычисляем ближайшее время запуска: dateFrom + time
    const [hours, minutes] = task.time.split(':').map(Number);
    // Создаём дату в московском часовом поясе (UTC+3)
    const mskDate = new Date(task.dateFrom + 'T' + task.time + ':00+03:00');
    // Если заданное время уже прошло (сравниваем в UTC), переносим на сутки вперёд
    let nextRunUtc = mskDate;
    if (nextRunUtc <= now) {
      nextRunUtc = new Date(nextRunUtc.getTime() + 24 * 60 * 60 * 1000);
    }
    const nextRun = nextRunUtc.toISOString(); // UTC

    const newTask: SchedulerTask = {
      id,
      userId: task.userId,
      time: task.time,
      instruments: task.instruments,
      dateFrom: task.dateFrom,
      dateTo: task.dateTo,
      interval: task.interval,
      strategy: task.strategy,
      params: task.params,
      useGrid: task.useGrid || false,
      gridConfig: task.gridConfig || null,
      useVolumeFilter: task.useVolumeFilter || false,
      volumeFilterConfig: task.volumeFilterConfig || null,
      enabled: true,
      lastRun: null,
      nextRun: nextRun,
      lastBatchId: null,
    };

    // Сохраняем в БД
    try {
      const { error } = await SBase.from('scheduler_tasks').insert({
        id: newTask.id,
        user_id: newTask.userId || null,
        time: newTask.time,
        instruments: newTask.instruments,
        date_from: newTask.dateFrom,
        date_to: newTask.dateTo,
        interval: newTask.interval,
        strategy: newTask.strategy,
        params: newTask.params,
        use_grid: newTask.useGrid,
        grid_config: newTask.gridConfig,
        use_volume_filter: newTask.useVolumeFilter,
        volume_filter_config: newTask.volumeFilterConfig,
        enabled: true,
        last_run: null,
        next_run: newTask.nextRun,
        created_at: now.toISOString(),
      });
      if (error) {
        console.error('[DailyScheduler] Insert error details:',
          'code:', (error as any).code,
          'message:', error.message,
          'details:', (error as any).details,
          'hint:', (error as any).hint
        );
        throw new Error('Failed to save task');
      }
    } catch (err) {
      console.error('[DailyScheduler] Error saving task to DB:', err);
      throw err;
    }

    this.tasks.push(newTask);
    return newTask;
  }

  async removeTask(id: string): Promise<void> {
    this.tasks = this.tasks.filter(t => t.id !== id);
    try {
      await SBase.from('scheduler_tasks').delete().eq('id', id);
    } catch (err) {
      console.error('[DailyScheduler] Error deleting task from DB:', err);
    }
  }

  getTasks(): SchedulerTask[] {
    return this.tasks;
  }

  private scheduleNextTick(): void {
    if (this.timer) clearTimeout(this.timer);
    const now = new Date();
    // Находим ближайшую задачу по времени nextRun
    let nextTime: number | null = null;
    for (const task of this.tasks) {
      if (!task.nextRun) continue;
      const runTime = new Date(task.nextRun).getTime();
      if (runTime > now.getTime() && (nextTime === null || runTime < nextTime)) {
        nextTime = runTime;
      }
    }
    if (nextTime) {
      const delay = nextTime - now.getTime();
      this.timer = setTimeout(() => this.tick(), delay);
    } else {
      // Нет запланированных задач, проверяем раз в минуту
      this.timer = setTimeout(() => this.scheduleNextTick(), 60000);
    }
  }

  private async tick(): Promise<void> {
    const now = new Date();
    for (const task of this.tasks) {
      if (!task.nextRun) continue;
      const runTime = new Date(task.nextRun);
      if (runTime <= now) {
        // Запускаем batch
        console.log(`[DailyScheduler] Running task ${task.id}`);
        try {
          await this.runBatchFromTask(task);
          // Обновляем lastRun и nextRun
          task.lastRun = now.toISOString();
          // Рассчитываем следующий запуск: та же дата + время? Если период dateFrom..dateTo, логично сдвигать дату
          // Пока для простоты: nextRun = завтра в то же время
          // Новый:
          // в tick, после расчёта следующего запуска
          const lastRunMsk = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Moscow' }));
          lastRunMsk.setDate(lastRunMsk.getDate() + 1); // следующие сутки по Москве
          const [h, m] = task.time.split(':').map(Number);
          lastRunMsk.setHours(h, m, 0, 0);
          const nextUtc = lastRunMsk.toISOString();   // ← получаем строку ISO
          // Проверка dateTo
          const dateToMsk = new Date(task.dateTo + 'T23:59:59+03:00');
          if (task.dateTo && new Date(nextUtc) > dateToMsk) {
            task.enabled = false;
            task.nextRun = null;
          } else {
            task.nextRun = nextUtc;   // ← присваиваем строку, НЕ вызываем .toISOString()!
          }
          await this.updateTaskInDB(task);
        } catch (err) {
          console.error(`[DailyScheduler] Failed to run task ${task.id}:`, err);
        }
      }
    }
    this.scheduleNextTick();
  }

  private async runBatchFromTask(task: SchedulerTask): Promise<void> {
    // Генерируем параметры сетки, если нужно
    let combos: any[] = [task.params];
    if (task.useGrid && task.gridConfig) {
      const grid = this.generateGrid(task.gridConfig, task.useVolumeFilter ? task.volumeFilterConfig : undefined);
      if (grid.length > 0) combos = grid;
    }

    const batchId = `sched_batch_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;
    task.lastBatchId = batchId;
    // Обновим в БД сразу (можно вместе с другими полями позже, но лучше сразу)
    try {
      await SBase.from('scheduler_tasks')
        .update({ last_batch_id: batchId })
        .eq('id', task.id);
    } catch (e) {
      console.warn('[DailyScheduler] Failed to update last_batch_id', e);
    }

    // Создаём запись batch в БД
    await SBase.from('backtest_batches').insert({
      id: batchId,
      user_id: task.userId || null,
      params: { instruments: task.instruments, dateFrom: task.dateFrom, dateTo: task.dateTo, interval: task.interval, strategy: task.strategy, params: task.params },
      status: 'pending'
    });

    // Создаём задачи для каждого инструмента и каждой комбинации
    for (const uid of task.instruments) {
      for (const combo of combos) {
        const taskId = `${batchId}_${uid}_${Date.now()}_${Math.random().toString(36).substr(2,4)}`;
        this.backtestQueue.addTask({
          taskId,
          batchId,
          userId: task.userId,
          instrumentUid: uid,
          dateFrom: task.dateFrom,
          dateTo: task.dateTo,
          interval: task.interval,
          strategy: task.strategy,
          params: { ...task.params, ...combo },
          marketPhase: '',
          status: 'pending'
        });
      }
    }

    // batch перейдёт в running, когда начнёт выполняться первая задача (логика в backtestQueue)
  }

  private generateGrid(gridConfig: any, volumeConfig?: any): any[] {
    const slMin = gridConfig.slMin;
    const slMax = gridConfig.slMax;
    const slStep = gridConfig.slStep;
    const tpMin = gridConfig.tpMin;
    const tpMax = gridConfig.tpMax;
    const tpStep = gridConfig.tpStep;
    const trailMin = gridConfig.trailMin;
    const trailMax = gridConfig.trailMax;
    const trailStep = gridConfig.trailStep;
    const lotsMin = gridConfig.lotsMin;
    const lotsMax = gridConfig.lotsMax;
    const lotsStep = gridConfig.lotsStep;
    const riskMin = gridConfig.riskMin;
    const riskMax = gridConfig.riskMax;
    const riskStep = gridConfig.riskStep;
    const volPeriodMin = volumeConfig?.min;
    const volPeriodMax = volumeConfig?.max;
    const volPeriodStep = volumeConfig?.step;

    const slVals = slMin != null ? this.range(slMin, slMax, slStep) : [undefined];
    const tpVals = tpMin != null ? this.range(tpMin, tpMax, tpStep) : [undefined];
    const trailVals = trailMin != null ? this.range(trailMin, trailMax, trailStep) : [undefined];
    const lotsVals = lotsMin != null ? this.range(lotsMin, lotsMax, lotsStep) : [undefined];
    const riskVals = riskMin != null ? this.range(riskMin, riskMax, riskStep) : [undefined];
    const volPeriodVals = volPeriodMin != null ? this.range(volPeriodMin, volPeriodMax, volPeriodStep) : [undefined];

    const grid: any[] = [];
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
                  volumeFilterEnabled: volumeConfig != null,
                  volumeFilterPeriod: vp,
                });
              }
    return grid;
  }

  private range(min: number, max: number, step: number): number[] {
    if (!step || step <= 0) return [min];
    const arr = [];
    for (let v = min; v <= max + 0.0001; v += step) arr.push(Math.round(v * 100) / 100);
    return arr;
  }

  private async updateTaskInDB(task: SchedulerTask): Promise<void> {
    try {
      await SBase.from('scheduler_tasks')
        .update({
          enabled: task.enabled,
          last_run: task.lastRun,
          next_run: task.nextRun,
        })
        .eq('id', task.id);
    } catch (err) {
      console.error('[DailyScheduler] Error updating task in DB:', err);
    }
  }
}