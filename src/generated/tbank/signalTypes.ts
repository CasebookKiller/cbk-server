import type { Timestamp, Quotation } from '../commonTypes';

/** Тип стратегии */
export enum StrategyType {
  /** Не определен */
  STRATEGY_TYPE_UNSPECIFIED = 0,
  /** Техническая стратегия */
  STRATEGY_TYPE_TECHNICAL = 1,
  /** Фундаментальная стратегия */
  STRATEGY_TYPE_FUNDAMENTAL = 2,
}

/** Направление сигнала */
export enum SignalDirection {
  /** Не определен */
  SIGNAL_DIRECTION_UNSPECIFIED = 0,
  /** Покупка */
  SIGNAL_DIRECTION_BUY = 1,
  /** Продажа */
  SIGNAL_DIRECTION_SELL = 2,
}

/** Статус сигнала */
export enum SignalState {
  /** Не определен */
  SIGNAL_STATE_UNSPECIFIED = 0,
  /** Активный сигнал */
  SIGNAL_STATE_ACTIVE = 1,
  /** Закрытый сигнал */
  SIGNAL_STATE_CLOSED = 2,
  /** Все состояния */
  SIGNAL_STATE_ALL = 3,
}

/** Параметры пагинации */
export interface Page {
  limit?: number;
  pageNumber?: number;
}

/** Ответ пагинации */
export interface PageResponse {
  limit?: number;
  pageNumber?: number;
  totalCount?: number;
}

/** Запрос сигналов */
export interface GetSignalsRequest {
  signalId?: string;
  strategyId?: string;
  strategyType?: StrategyType;
  instrumentUid?: string;
  from?: Timestamp;
  to?: Timestamp;
  direction?: SignalDirection;
  active?: SignalState;
  paging?: Page;
}

/** Сигнал */
export interface Signal {
  signalId?: string;
  strategyId?: string;
  strategyName?: string;
  instrumentUid?: string;
  createDt?: Timestamp;
  direction?: SignalDirection;
  initialPrice?: Quotation;
  info?: string;
  name?: string;
  targetPrice?: Quotation;
  endDt?: Timestamp;
  probability?: number;
  stoploss?: Quotation;
  closePrice?: Quotation;
  closeDt?: Timestamp;
}

/** Ответ списка сигналов */
export interface GetSignalsResponse {
  signals?: Signal[];
  paging?: PageResponse;
}

/** Запрос стратегий */
export interface GetStrategiesRequest {
  strategyId?: string;
}

/** Стратегия */
export interface Strategy {
  strategyId?: string;
  strategyName?: string;
  strategyDescription?: string;
  strategyUrl?: string;
  strategyType?: StrategyType;
  activeSignals?: number;
  totalSignals?: number;
  timeInPosition?: number;
  averageSignalYield?: Quotation;
  averageSignalYieldYear?: Quotation;
  yield?: Quotation;
  yieldYear?: Quotation;
}

/** Ответ списка стратегий */
export interface GetStrategiesResponse {
  strategies?: Strategy[];
}