import { marketDataGrpc } from '../services/tbank/MarketDataGrpcService';
import { CandleInterval, CandleSourceRequest } from '../generated/marketdataTypes';
import type { StreamCandle } from './types';

function quotationToNumber(q: any): number {
  if (!q) return 0;
  const units = Number(q.units || 0);
  const nano = q.nano || 0;
  return units + nano / 1e9;
}

function timestampToISO(ts: any): string {
  if (!ts) return new Date().toISOString();
  if (typeof ts === 'object' && ts.seconds !== undefined) {
    return new Date(ts.seconds * 1000).toISOString();
  }
  if (typeof ts === 'string') return new Date(ts).toISOString();
  return new Date().toISOString();
}

export class HistoricalDataLoader {
  async loadIntradayCandles(
    instrumentUid: string,
    from: Date,
    to: Date,
    token: string,
    interval: CandleInterval = CandleInterval.CANDLE_INTERVAL_1_MIN
  ): Promise<StreamCandle[]> {
    const allCandles: StreamCandle[] = [];
    let currentDate = new Date(from);
    currentDate.setHours(7, 0, 0, 0); // начало основной сессии МСК

    while (currentDate <= to) {
      const dayFrom = new Date(currentDate);
      const dayTo = new Date(currentDate);
      dayTo.setHours(16, 0, 0, 0); // конец основной сессии
      if (dayTo > to) dayTo.setTime(to.getTime());

      const request = {
        instrumentId: instrumentUid,
        interval,
        from: { seconds: Math.floor(dayFrom.getTime() / 1000), nanos: 0 },
        to: { seconds: Math.floor(dayTo.getTime() / 1000), nanos: 0 },
        candleSourceType: CandleSourceRequest.CANDLE_SOURCE_EXCHANGE,
      };

      const response = await marketDataGrpc.getCandles(request, token);
      const candles = response.candles || [];

      const dayCandles = candles.map(candle => ({
        instrumentUid,
        open: candle.open,
        high: candle.high,
        low: candle.low,
        close: candle.close,
        volume: String(candle.volume || '0'),
        time: timestampToISO(candle.time),
      }));

      allCandles.push(...dayCandles);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return allCandles;
  }
}