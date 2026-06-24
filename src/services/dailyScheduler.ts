// src/services/dailyScheduler.ts
import { BacktestQueue } from '../backtest/backtestQueue';
import { HistoricalDataLoader } from '../backtest/historicalDataLoader';
import { CandleInterval } from '../generated/marketdataTypes';

const INTERVAL_MAP: Record<string, CandleInterval> = {
  'CANDLE_INTERVAL_1_MIN': CandleInterval.CANDLE_INTERVAL_1_MIN,
  'CANDLE_INTERVAL_5_MIN': CandleInterval.CANDLE_INTERVAL_5_MIN,
  'CANDLE_INTERVAL_HOUR': CandleInterval.CANDLE_INTERVAL_HOUR,
};

interface ScheduledTask {
  id: string;
  time: string;        // "HH:mm" UTC
  instruments: string[];
  dateFrom: string;    // "YYYY-MM-DD"
  dateTo: string;
  interval: string;
  strategy: string;
  params: any;
  lastRun: string | null;
  nextRun: string;
}

export class DailyScheduler {
  private tasks: ScheduledTask[] = [];
  private intervalId: NodeJS.Timeout | null = null;

  constructor(private backtestQueue: BacktestQueue) {}

  /** Запустить планировщик */
  start() {
    // Проверяем каждые 60 секунд
    this.intervalId = setInterval(() => this.checkAndRun(), 60_000);
    console.log('[Scheduler] Started');
  }

  /** Остановить планировщик */
  stop() {
    if (this.intervalId) clearInterval(this.intervalId);
    console.log('[Scheduler] Stopped');
  }

  /** Добавить задание */
  addTask(task: ScheduledTask) {
    this.tasks.push(task);
    console.log(`[Scheduler] Task added: ${task.id}`);
  }

  /** Удалить задание */
  removeTask(id: string) {
    this.tasks = this.tasks.filter(t => t.id !== id);
    console.log(`[Scheduler] Task removed: ${id}`);
  }

  /** Получить все задания */
  getTasks(): ScheduledTask[] {
    return this.tasks;
  }

  /** Проверить и запустить задания, время которых наступило */
  private async checkAndRun() {
    const now = new Date();
    const currentTime = now.toISOString().slice(11, 16); // "HH:mm"

    for (const task of this.tasks) {
      if (task.time === currentTime && task.lastRun !== now.toISOString().slice(0, 10)) {
        console.log(`[Scheduler] Running task ${task.id}`);
        try {
          const batchId = `sched_${Date.now()}_${task.id}`;

          // Создаём batch через BacktestQueue
          for (const uid of task.instruments) {
            const taskId = `${batchId}_${uid}_${Date.now()}`;
            this.backtestQueue.addTask({
              taskId,
              batchId,
              userId: 1, // системный пользователь
              instrumentUid: uid,
              dateFrom: task.dateFrom,
              dateTo: task.dateTo,
              interval: INTERVAL_MAP[task.interval] || CandleInterval.CANDLE_INTERVAL_1_MIN,
              strategy: task.strategy,
              params: task.params,
              marketPhase: '',
              status: 'pending'
            });
          }

          // Сохраняем batch в Supabase
          const SBase = require('../supabaseClient').default;
          await (SBase.from('backtest_batches') as any).insert({
            id: batchId,
            user_id: 1,
            params: {
              instruments: task.instruments,
              dateFrom: task.dateFrom,
              dateTo: task.dateTo,
              interval: task.interval,
              strategy: task.strategy,
              params: task.params,
            },
            status: 'running'
          });

          task.lastRun = now.toISOString().slice(0, 10);
        } catch (err) {
          console.error(`[Scheduler] Error running task ${task.id}:`, err);
        }
      }
    }
  }
}