// src/backtest/types.ts

export interface StreamCandle {
  instrumentUid: string;
  open: any; // Quotation
  high: any;
  low: any;
  close: any;
  volume: string;
  time: string;
}

export interface Quotation {
  units?: string | number;
  nano?: number;
}