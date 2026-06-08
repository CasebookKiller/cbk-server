import { HistoricalDataLoader } from './historicalDataLoader';
import { VolumeProfileEngine } from './volumeProfileEngine';
import { BacktestEngine } from './backtestEngine';
import { VolumeAccumulationStrategy } from './strategies/VolumeAccumulationStrategy';
import { CandleInterval } from '../generated/marketdataTypes';

interface Task {
  taskId: string;
  instrumentUid: string;
  dateFrom: string;
  dateTo: string;
  interval: CandleInterval;
  params: any;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: any;
  error?: string;
}

export class BacktestQueue {
  private tasks = new Map<string, Task>();
  private running = false;

  constructor(private loader: HistoricalDataLoader) {}

  public addTask(task: Task): void {
    this.tasks.set(task.taskId, task);
    this.process();
  }

  public getTask(taskId: string): Task | undefined {
    return this.tasks.get(taskId);
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
    try {
      const from = new Date(task.dateFrom + 'T07:00:00Z');
      const to = new Date(task.dateTo + 'T16:00:00Z');
      const token = process.env.TReadOnly || '';
      const candles = await this.loader.loadIntradayCandles(
        task.instrumentUid, from, to, token, task.interval
      );

      const engine = new VolumeProfileEngine({ skipAutoSubscribe: true });
      candles.forEach(c => engine.feedCandle(c));
      const profile = engine.getProfile(task.instrumentUid);

      const strategy = new VolumeAccumulationStrategy(task.instrumentUid, profile);
      const backtestEngine = new BacktestEngine();
      const stats = backtestEngine.run(strategy, candles);

      task.result = stats;
      task.status = 'completed';
    } catch (err: any) {
      task.status = 'failed';
      task.error = err.message;
    }
  }
}