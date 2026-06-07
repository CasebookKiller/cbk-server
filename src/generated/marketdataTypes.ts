// /src/api/tbank/marketdataTypes.ts

// 1. GetCandles

import type { Timestamp, Quotation } from './commonTypes';
import { SecurityTradingStatus } from './instrumentsTypes';

// ==================== Перечисления ====================

/** Интервал свечей */
export enum CandleInterval {
  /** Интервал не определён */
  CANDLE_INTERVAL_UNSPECIFIED = 0,
  /** 1 минута. Максимальный `limit` — 2400 */
  CANDLE_INTERVAL_1_MIN = 1,
  /** 5 минут. Максимальный `limit` — 2400 */
  CANDLE_INTERVAL_5_MIN = 2,
  /** 15 минут. Максимальный `limit` — 2400 */
  CANDLE_INTERVAL_15_MIN = 3,
  /** 1 час. Максимальный `limit` — 2400 */
  CANDLE_INTERVAL_HOUR = 4,
  /** 1 день. Максимальный `limit` — 2400 */
  CANDLE_INTERVAL_DAY = 5,
  /** 2 минуты. Максимальный `limit` — 1200 */
  CANDLE_INTERVAL_2_MIN = 6,
  /** 3 минуты. Максимальный `limit` — 750 */
  CANDLE_INTERVAL_3_MIN = 7,
  /** 10 минут. Максимальный `limit` — 1200 */
  CANDLE_INTERVAL_10_MIN = 8,
  /** 30 минут. Максимальный `limit` — 1200 */
  CANDLE_INTERVAL_30_MIN = 9,
  /** 2 часа. Максимальный `limit` — 2400 */
  CANDLE_INTERVAL_2_HOUR = 10,
  /** 4 часа. Максимальный `limit` — 700 */
  CANDLE_INTERVAL_4_HOUR = 11,
  /** 1 неделя. Максимальный `limit` — 300 */
  CANDLE_INTERVAL_WEEK = 12,
  /** 1 месяц. Максимальный `limit` — 120 */
  CANDLE_INTERVAL_MONTH = 13,
  /** 5 секунд. Максимальный `limit` — 2500 */
  CANDLE_INTERVAL_5_SEC = 14,
  /** 10 секунд. Максимальный `limit` — 1250 */
  CANDLE_INTERVAL_10_SEC = 15,
  /** 30 секунд. Максимальный `limit` — 2500 */
  CANDLE_INTERVAL_30_SEC = 16,
}

/** Тип источника свечи (в запросе) */
export enum CandleSourceRequest {
  /** Все свечи */
  CANDLE_SOURCE_UNSPECIFIED = 0,
  /** Биржевые свечи */
  CANDLE_SOURCE_EXCHANGE = 1,
  /** Все свечи с учётом торговли по выходным */
  CANDLE_SOURCE_INCLUDE_WEEKEND = 3,
}

/** Тип источника свечи (в ответе) */
export enum CandleSourceHistoric {
  /** Источник свечей не определён */
  CANDLE_SOURCE_UNSPECIFIED = 0,
  /** Биржевые свечи */
  CANDLE_SOURCE_EXCHANGE = 1,
  /** Свечи дилера в результате торговли по выходным */
  CANDLE_SOURCE_DEALER_WEEKEND = 2,
}

// ==================== Запрос / Ответ ====================

/** Запрос исторических свечей */
export interface GetCandlesRequest {
  /** Deprecated FIGI-идентификатор. Используйте `instrument_id`. */
  figi?: string;
  /** Начало запрашиваемого периода по UTC */
  from?: Timestamp;
  /** Окончание запрашиваемого периода по UTC */
  to?: Timestamp;
  /** Интервал свечей */
  interval?: CandleInterval;
  /** Идентификатор инструмента (`figi`, `instrument_uid` или `ticker_class_code`) */
  instrumentId?: string;
  /** Тип источника свечи */
  candleSourceType?: CandleSourceRequest;
  /** Максимальное количество свечей в ответе */
  limit?: number;
}

/** Информация о свече */
export interface HistoricCandle {
  /** Цена открытия за 1 инструмент */
  open?: Quotation;
  /** Максимальная цена за 1 инструмент */
  high?: Quotation;
  /** Минимальная цена за 1 инструмент */
  low?: Quotation;
  /** Цена закрытия за 1 инструмент */
  close?: Quotation;
  /** Объем торгов в лотах */
  volume?: number;
  /** Время свечи по UTC */
  time?: Timestamp;
  /** Признак завершённости свечи (false — свеча ещё формируется) */
  isComplete?: boolean;
  /** Тип источника свечи */
  candleSource?: CandleSourceHistoric;
  /** Объем торгов на покупку */
  volumeBuy?: number;
  /** Объем торгов на продажу */
  volumeSell?: number;
}

/** Список свечей */
export interface GetCandlesResponse {
  /** Массив свечей */
  candles?: HistoricCandle[];
}

// 2.GetClosePrices

// (добавляем после существующих типов)

/** Статус запрашиваемых инструментов */
export enum InstrumentStatus {
  /** Значение не определено */
  INSTRUMENT_STATUS_UNSPECIFIED = 0,
  /** Базовый список инструментов (по умолчанию) */
  INSTRUMENT_STATUS_BASE = 1,
  /** Все инструменты */
  INSTRUMENT_STATUS_ALL = 2,
}

/** Запрос цены закрытия по одному инструменту */
export interface InstrumentClosePriceRequest {
  /** Идентификатор инструмента (figi, instrument_uid или ticker_class_code) */
  instrumentId?: string;
}

/** Запрос цен закрытия торговой сессии */
export interface GetClosePricesRequest {
  /** Массив запросов по инструментам */
  instruments?: InstrumentClosePriceRequest[];
  /** Статус запрашиваемых инструментов */
  instrumentStatus?: InstrumentStatus;
}

/** Цена закрытия торговой сессии по инструменту */
export interface InstrumentClosePriceResponse {
  /** FIGI инструмента */
  figi?: string;
  /** UID инструмента */
  instrumentUid?: string;
  /** Тикер инструмента */
  ticker?: string;
  /** Класс-код (секция торгов) */
  classCode?: string;
  /** Цена закрытия торговой сессии */
  price?: Quotation;
  /** Цена последней сделки с вечерней сессии */
  eveningSessionPrice?: Quotation;
  /** Дата совершения торгов */
  time?: Timestamp;
  /** Дата цены закрытия вечерней сессии */
  eveningSessionPriceTime?: Timestamp;
}

/** Ответ с ценами закрытия */
export interface GetClosePricesResponse {
  /** Массив цен закрытия */
  closePrices?: InstrumentClosePriceResponse[];
}

// 3. GetLastPrices

/** Тип последней цены */
export enum LastPriceType {
  /** Не определён */
  LAST_PRICE_UNSPECIFIED = 0,
  /** Цена биржи */
  LAST_PRICE_EXCHANGE = 1,
  /** Цена дилера */
  LAST_PRICE_DEALER = 2,
}

/** Запрос получения цен последних сделок */
export interface GetLastPricesRequest {
  /** Deprecated FIGI-идентификаторы (используйте instrument_id) */
  figi?: string[];
  /** Массив идентификаторов инструментов (figi, instrument_uid или ticker_class_code) */
  instrumentId?: string[];
  /** Тип запрашиваемой последней цены */
  lastPriceType?: LastPriceType;
  /** Статус запрашиваемых инструментов */
  instrumentStatus?: InstrumentStatus;
}

/** Информация о цене последней сделки */
export interface LastPrice {
  /** FIGI инструмента */
  figi?: string;
  /** Цена последней сделки за 1 инструмент */
  price?: Quotation;
  /** Время получения последней цены по UTC */
  time?: Timestamp;
  /** Тикер инструмента */
  ticker?: string;
  /** Класс-код (секция торгов) */
  classCode?: string;
  /** UID инструмента */
  instrumentUid?: string;
  /** Тип последней цены */
  lastPriceType?: LastPriceType;
}

/** Ответ со списком цен последних сделок */
export interface GetLastPricesResponse {
  /** Массив цен последних сделок */
  lastPrices?: LastPrice[];
}

// 4. GetLastTrades

/** Тип источника сделок (в запросе и ответе) */
export enum TradeSourceType {
  /** Тип источника сделки не определён */
  TRADE_SOURCE_UNSPECIFIED = 0,
  /** Биржевые сделки */
  TRADE_SOURCE_EXCHANGE = 1,
  /** Сделки дилера */
  TRADE_SOURCE_DEALER = 2,
  /** Все сделки */
  TRADE_SOURCE_ALL = 3,
}

/** Направление сделки */
export enum TradeDirection {
  /** Направление сделки не определено */
  TRADE_DIRECTION_UNSPECIFIED = 0,
  /** Покупка */
  TRADE_DIRECTION_BUY = 1,
  /** Продажа */
  TRADE_DIRECTION_SELL = 2,
}

/** Запрос обезличенных сделок за последний час */
export interface GetLastTradesRequest {
  /** Deprecated FIGI-идентификатор. Используйте `instrument_id`. */
  figi?: string;
  /** Начало запрашиваемого периода по UTC */
  from?: Timestamp;
  /** Окончание запрашиваемого периода по UTC */
  to?: Timestamp;
  /** Идентификатор инструмента (figi, instrument_uid или ticker_class_code) */
  instrumentId?: string;
  /** Тип источника сделок (по умолчанию ALL) */
  tradeSource?: TradeSourceType;
}

/** Информация о сделке */
export interface Trade {
  /** FIGI-идентификатор инструмента */
  figi?: string;
  /** Направление сделки */
  direction?: TradeDirection;
  /** Цена за 1 инструмент */
  price?: Quotation;
  /** Количество лотов */
  quantity?: number;
  /** Время сделки по UTC (время биржи) */
  time?: Timestamp;
  /** UID инструмента */
  instrumentUid?: string;
  /** Тип источника сделки */
  tradeSource?: TradeSourceType;
  /** Тикер инструмента */
  ticker?: string;
  /** Класс-код (секция торгов) */
  classCode?: string;
}

/** Ответ со списком обезличенных сделок */
export interface GetLastTradesResponse {
  /** Массив сделок */
  trades?: Trade[];
}

// 5. GetMarketValues

/** Тип рыночного параметра */
export enum MarketValueType {
  /** Не определён */
  INSTRUMENT_VALUE_UNSPECIFIED = 0,
  /** Последняя биржевая цена */
  INSTRUMENT_VALUE_LAST_PRICE = 1,
  /** Последняя цена дилера */
  INSTRUMENT_VALUE_LAST_PRICE_DEALER = 2,
  /** Цена закрытия */
  INSTRUMENT_VALUE_CLOSE_PRICE = 3,
  /** Цена последней сделки с вечерней сессии */
  INSTRUMENT_VALUE_EVENING_SESSION_PRICE = 4,
  /** Открытый интерес (только для фьючерсов) */
  INSTRUMENT_VALUE_OPEN_INTEREST = 5,
  /** Теоретическая цена (только для опционов) */
  INSTRUMENT_VALUE_THEOR_PRICE = 6,
  /** Доходность */
  INSTRUMENT_VALUE_YIELD = 7,
}

/** Значение рыночного параметра */
export interface MarketValue {
  /** Тип параметра */
  type?: MarketValueType;
  /** Значение */
  value?: Quotation;
  /** Дата и время */
  time?: Timestamp;
}

/** Инструмент с набором рыночных параметров */
export interface MarketValueInstrument {
  /** Идентификатор инструмента */
  instrumentUid?: string;
  /** Массив рыночных параметров */
  values?: MarketValue[];
  /** Тикер инструмента */
  ticker?: string;
  /** Класс-код (секция торгов) */
  classCode?: string;
}

/** Запрос рыночных данных по инструментам */
export interface GetMarketValuesRequest {
  /** Массив идентификаторов инструментов (figi, instrument_uid или ticker_class_code) */
  instrumentId?: string[];
  /** Массив запрашиваемых параметров */
  values?: MarketValueType[];
}

/** Ответ с рыночными данными */
export interface GetMarketValuesResponse {
  /** Массив инструментов с параметрами */
  instruments?: MarketValueInstrument[];
}

// 6. GetOrderBook

/** Запрос стакана */
export interface GetOrderBookRequest {
  /** Deprecated FIGI-идентификатор (используйте instrument_id) */
  figi?: string;
  /** Глубина стакана */
  depth?: number;
  /** Идентификатор инструмента (figi, instrument_uid или ticker_class_code) */
  instrumentId?: string;
}

/** Заявка в стакане (бид или аск) */
export interface Order {
  /** Цена за 1 инструмент */
  price?: Quotation;
  /** Количество в лотах */
  quantity?: number;
}

/** Информация о стакане */
export interface GetOrderBookResponse {
  /** FIGI-идентификатор инструмента */
  figi?: string;
  /** Глубина стакана */
  depth?: number;
  /** Заявки на покупку */
  bids?: Order[];
  /** Заявки на продажу */
  asks?: Order[];
  /** Цена последней сделки за 1 инструмент */
  lastPrice?: Quotation;
  /** Цена закрытия */
  closePrice?: Quotation;
  /** Верхний лимит цены */
  limitUp?: Quotation;
  /** Нижний лимит цены */
  limitDown?: Quotation;
  /** UID инструмента */
  instrumentUid?: string;
  /** Тикер инструмента */
  ticker?: string;
  /** Класс-код (секция торгов) */
  classCode?: string;
  /** Время получения цены последней сделки */
  lastPriceTs?: Timestamp;
  /** Время получения цены закрытия */
  closePriceTs?: Timestamp;
  /** Время формирования стакана на бирже */
  orderbookTs?: Timestamp;
}

// 7. GetTechAnalysis

// ------------------ Новые перечисления ------------------

/** Тип технического индикатора */
export enum IndicatorType {
  INDICATOR_TYPE_UNSPECIFIED = 0,
  /** Bollinger Bands — линия Боллинжера */
  INDICATOR_TYPE_BB = 1,
  /** Exponential Moving Average — EMA */
  INDICATOR_TYPE_EMA = 2,
  /** Relative Strength Index — RSI */
  INDICATOR_TYPE_RSI = 3,
  /** Moving Average Convergence/Divergence — MACD */
  INDICATOR_TYPE_MACD = 4,
  /** Simple Moving Average — SMA */
  INDICATOR_TYPE_SMA = 5,
}

/** Интервал свечи для технического индикатора */
export enum IndicatorInterval {
  INDICATOR_INTERVAL_UNSPECIFIED = 0,
  /** 1 минута */
  INDICATOR_INTERVAL_ONE_MINUTE = 1,
  /** 5 минут */
  INDICATOR_INTERVAL_FIVE_MINUTES = 2,
  /** 15 минут */
  INDICATOR_INTERVAL_FIFTEEN_MINUTES = 3,
  /** 1 час */
  INDICATOR_INTERVAL_ONE_HOUR = 4,
  /** 1 день */
  INDICATOR_INTERVAL_ONE_DAY = 5,
  /** 2 минуты */
  INDICATOR_INTERVAL_2_MIN = 6,
  /** 3 минуты */
  INDICATOR_INTERVAL_3_MIN = 7,
  /** 10 минут */
  INDICATOR_INTERVAL_10_MIN = 8,
  /** 30 минут */
  INDICATOR_INTERVAL_30_MIN = 9,
  /** 2 часа */
  INDICATOR_INTERVAL_2_HOUR = 10,
  /** 4 часа */
  INDICATOR_INTERVAL_4_HOUR = 11,
  /** Неделя */
  INDICATOR_INTERVAL_WEEK = 12,
  /** Месяц */
  INDICATOR_INTERVAL_MONTH = 13,
}

/** Тип цены для расчёта индикатора */
export enum TypeOfPrice {
  TYPE_OF_PRICE_UNSPECIFIED = 0,
  /** Цена закрытия */
  TYPE_OF_PRICE_CLOSE = 1,
  /** Цена открытия */
  TYPE_OF_PRICE_OPEN = 2,
  /** Максимальное значение за интервал */
  TYPE_OF_PRICE_HIGH = 3,
  /** Минимальное значение за интервал */
  TYPE_OF_PRICE_LOW = 4,
  /** Среднее по (close+open+high+low)/4 */
  TYPE_OF_PRICE_AVG = 5,
}

// ------------------ Структуры запроса ------------------

/** Параметры отклонения (для Bollinger Bands) */
export interface Deviation {
  /** Количество стандартных отклонений */
  deviationMultiplier?: Quotation;
}

/** Параметры сглаживания (для MACD) */
export interface Smoothing {
  /** Короткий период сглаживания для первой EMA */
  fastLength?: number;
  /** Длинный период сглаживания для второй EMA */
  slowLength?: number;
  /** Период сглаживания для третьей EMA */
  signalSmoothing?: number;
}

/** Запрос технических индикаторов */
export interface GetTechAnalysisRequest {
  /** Тип индикатора */
  indicatorType?: IndicatorType;
  /** UID инструмента */
  instrumentUid?: string;
  /** Начало периода по UTC */
  from?: Timestamp;
  /** Окончание периода по UTC */
  to?: Timestamp;
  /** Интервал расчёта */
  interval?: IndicatorInterval;
  /** Тип цены */
  typeOfPrice?: TypeOfPrice;
  /** Торговый период */
  length?: number;
  /** Параметры отклонения (для BB) */
  deviation?: Deviation;
  /** Параметры сглаживания (для MACD) */
  smoothing?: Smoothing;
}

// ------------------ Ответ ------------------

/** Элемент результата технического анализа */
export interface TechAnalysisItem {
  /** Временная метка (UTC) */
  timestamp?: Timestamp;
  /** Средняя линия (SMA / Bollinger middle) */
  middleBand?: Quotation;
  /** Верхняя линия Боллинджера */
  upperBand?: Quotation;
  /** Нижняя линия Боллинджера */
  lowerBand?: Quotation;
  /** Сигнальная линия */
  signal?: Quotation;
  /** Линия MACD */
  macd?: Quotation;
}

/** Ответ с результатами технического анализа */
export interface GetTechAnalysisResponse {
  /** Массив значений индикатора */
  technicalIndicators?: TechAnalysisItem[];
}

// 8. GetTradingStatus

/** Запрос торгового статуса инструмента */
export interface GetTradingStatusRequest {
  /** Deprecated FIGI-идентификатор (используйте instrument_id) */
  figi?: string;
  /** Идентификатор инструмента (figi, instrument_uid или ticker_class_code) */
  instrumentId?: string;
}

/** Информация о торговом статусе */
export interface GetTradingStatusResponse {
  /** FIGI-идентификатор инструмента */
  figi?: string;
  /** Статус торговли */
  tradingStatus?: SecurityTradingStatus; // импортирован из общих типов
  /** Доступность лимитной заявки */
  limitOrderAvailableFlag?: boolean;
  /** Доступность рыночной заявки */
  marketOrderAvailableFlag?: boolean;
  /** Доступность торгов через API */
  apiTradeAvailableFlag?: boolean;
  /** UID инструмента */
  instrumentUid?: string;
  /** Доступность заявки по лучшей цене */
  bestpriceOrderAvailableFlag?: boolean;
  /** Доступность только заявки по лучшей цене */
  onlyBestPrice?: boolean;
  /** Тикер инструмента */
  ticker?: string;
  /** Класс-код (секция торгов) */
  classCode?: string;
}

// 9. GetTradingStatuses

/** Запрос статусов торгов для нескольких инструментов */
export interface GetTradingStatusesRequest {
  /** Массив идентификаторов инструментов (figi, instrument_uid или ticker_class_code) */
  instrumentId?: string[];
}

/** Ответ со списком торговых статусов */
export interface GetTradingStatusesResponse {
  /** Массив статусов */
  tradingStatuses?: GetTradingStatusResponse[];
}