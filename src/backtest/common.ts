// src/backtest/common.ts

export interface BacktestSignal {
  type: 'BUY' | 'SELL';
  price: number;
  time: string;
  instrumentUid: string;
  reason: string;
}

/** Преобразует Quotation в число */
export function quotationToNumber(q: any): number {
  if (!q) return 0;
  const units = Number(q.units || '0');
  const nano = q.nano || 0;
  return units + nano / 1e9;
}