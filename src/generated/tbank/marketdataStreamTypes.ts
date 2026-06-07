// /src/api/tbank/marketdataStreamTypes.ts
import type { Timestamp } from '../commonTypes'; // Timestamp = string (ISO 8601)

// ---------- Вспомогательные литеральные типы (enum-подобные) ----------

export type SubscriptionAction = 'SUBSCRIPTION_ACTION_UNSPECIFIED' | 'SUBSCRIPTION_ACTION_SUBSCRIBE' | 'SUBSCRIPTION_ACTION_UNSUBSCRIBE';

export type SubscriptionInterval = 'SUBSCRIPTION_INTERVAL_UNSPECIFIED' | 'SUBSCRIPTION_INTERVAL_ONE_MINUTE' | 'SUBSCRIPTION_INTERVAL_FIVE_MINUTES' | 'SUBSCRIPTION_INTERVAL_FIFTEEN_MINUTES' | 'SUBSCRIPTION_INTERVAL_ONE_HOUR' | 'SUBSCRIPTION_INTERVAL_ONE_DAY' | 'SUBSCRIPTION_INTERVAL_2_MIN' | 'SUBSCRIPTION_INTERVAL_3_MIN' | 'SUBSCRIPTION_INTERVAL_10_MIN' | 'SUBSCRIPTION_INTERVAL_30_MIN' | 'SUBSCRIPTION_INTERVAL_2_HOUR' | 'SUBSCRIPTION_INTERVAL_4_HOUR' | 'SUBSCRIPTION_INTERVAL_WEEK' | 'SUBSCRIPTION_INTERVAL_MONTH';

export type OrderBookType = 'ORDERBOOK_TYPE_UNSPECIFIED' | 'ORDERBOOK_TYPE_EXCHANGE' | 'ORDERBOOK_TYPE_DEALER' | 'ORDERBOOK_TYPE_ALL';

export type TradeSourceType = 'TRADE_SOURCE_UNSPECIFIED' | 'TRADE_SOURCE_EXCHANGE' | 'TRADE_SOURCE_DEALER' | 'TRADE_SOURCE_ALL';

export type SubscriptionStatus = 'SUBSCRIPTION_STATUS_UNSPECIFIED' | 'SUBSCRIPTION_STATUS_SUCCESS' | 'SUBSCRIPTION_STATUS_INSTRUMENT_NOT_FOUND' | 'SUBSCRIPTION_STATUS_SUBSCRIPTION_ACTION_IS_INVALID' | 'SUBSCRIPTION_STATUS_DEPTH_IS_INVALID' | 'SUBSCRIPTION_STATUS_INTERVAL_IS_INVALID' | 'SUBSCRIPTION_STATUS_LIMIT_IS_EXCEEDED' | 'SUBSCRIPTION_STATUS_INTERNAL_ERROR' | 'SUBSCRIPTION_STATUS_TOO_MANY_REQUESTS' | 'SUBSCRIPTION_STATUS_SUBSCRIPTION_NOT_FOUND' | 'SUBSCRIPTION_STATUS_SOURCE_IS_INVALID';

export type CandleSource = 'CANDLE_SOURCE_UNSPECIFIED' | 'CANDLE_SOURCE_EXCHANGE' | 'CANDLE_SOURCE_INCLUDE_WEEKEND' | 'CANDLE_SOURCE_DEALER_WEEKEND';

export type TradeDirection = 'TRADE_DIRECTION_UNSPECIFIED' | 'TRADE_DIRECTION_BUY' | 'TRADE_DIRECTION_SELL';

export type LastPriceType = 'LAST_PRICE_UNSPECIFIED' | 'LAST_PRICE_EXCHANGE' | 'LAST_PRICE_DEALER';

// Котировка (исправлены units на string)
export interface Quotation {
  /** Целая часть суммы (int64 -> string) */
  units?: string;
  /** Дробная часть (int32) */
  nano?: number;
}

// ---------- Запросы ----------

export interface CandleInstrument {
  figi?: string;
  interval?: SubscriptionInterval;
  instrumentId?: string;
}

export interface SubscribeCandlesRequest {
  subscriptionAction?: SubscriptionAction;
  instruments?: CandleInstrument[];
  waitingClose?: boolean;
  candleSourceType?: CandleSource;
}

export interface OrderBookInstrument {
  figi?: string;
  depth?: number;
  instrumentId?: string;
  orderBookType?: OrderBookType;
}

export interface SubscribeOrderBookRequest {
  subscriptionAction?: SubscriptionAction;
  instruments?: OrderBookInstrument[];
}

export interface TradeInstrument {
  figi?: string;
  instrumentId?: string;
}

export interface SubscribeTradesRequest {
  subscriptionAction?: SubscriptionAction;
  instruments?: TradeInstrument[];
  tradeSource?: TradeSourceType;
  withOpenInterest?: boolean;
}

export interface InfoInstrument {
  figi?: string;
  instrumentId?: string;
}

export interface SubscribeInfoRequest {
  subscriptionAction?: SubscriptionAction;
  instruments?: InfoInstrument[];
}

export interface LastPriceInstrument {
  figi?: string;
  instrumentId?: string;
}

export interface SubscribeLastPriceRequest {
  subscriptionAction?: SubscriptionAction;
  instruments?: LastPriceInstrument[];
}

export interface PingDelaySettings {
  pingDelayMs?: number;
}

export interface GetMySubscriptions {}

export interface PingRequest {
  time?: Timestamp;
}

export interface MarketDataServerSideStreamRequest {
  subscribeCandlesRequest?: SubscribeCandlesRequest;
  subscribeOrderBookRequest?: SubscribeOrderBookRequest;
  subscribeTradesRequest?: SubscribeTradesRequest;
  subscribeInfoRequest?: SubscribeInfoRequest;
  subscribeLastPriceRequest?: SubscribeLastPriceRequest;
  pingSettings?: PingDelaySettings;
}

export interface MarketDataStreamRequest {
  subscribeCandlesRequest?: SubscribeCandlesRequest;
  subscribeOrderBookRequest?: SubscribeOrderBookRequest;
  subscribeTradesRequest?: SubscribeTradesRequest;
  subscribeInfoRequest?: SubscribeInfoRequest;
  subscribeLastPriceRequest?: SubscribeLastPriceRequest;
  getMySubscriptions?: GetMySubscriptions;
  ping?: PingRequest;
  pingSettings?: PingDelaySettings;
}

// ---------- Ответы ----------

export interface CandleSubscription {
  figi?: string;
  interval?: SubscriptionInterval;
  subscriptionStatus?: SubscriptionStatus;
  instrumentUid?: string;
  waitingClose?: boolean;
  streamId?: string;
  subscriptionId?: string;
  subscriptionAction?: SubscriptionAction;
  candleSourceType?: CandleSource;
  ticker?: string;
  classCode?: string;
}

export interface SubscribeCandlesResponse {
  trackingId?: string;
  candlesSubscriptions?: CandleSubscription[];
}

export interface OrderBookSubscription {
  figi?: string;
  depth?: number;
  subscriptionStatus?: SubscriptionStatus;
  instrumentUid?: string;
  streamId?: string;
  subscriptionId?: string;
  orderBookType?: OrderBookType;
  subscriptionAction?: SubscriptionAction;
  ticker?: string;
  classCode?: string;
}

export interface SubscribeOrderBookResponse {
  trackingId?: string;
  orderBookSubscriptions?: OrderBookSubscription[];
}

export interface TradeSubscription {
  figi?: string;
  subscriptionStatus?: SubscriptionStatus;
  instrumentUid?: string;
  streamId?: string;
  subscriptionId?: string;
  withOpenInterest?: boolean;
  subscriptionAction?: SubscriptionAction;
  ticker?: string;
  classCode?: string;
}

export interface SubscribeTradesResponse {
  trackingId?: string;
  tradeSubscriptions?: TradeSubscription[];
  tradeSource?: TradeSourceType;
}

export interface InfoSubscription {
  figi?: string;
  subscriptionStatus?: SubscriptionStatus;
  instrumentUid?: string;
  streamId?: string;
  subscriptionId?: string;
  subscriptionAction?: SubscriptionAction;
  ticker?: string;
  classCode?: string;
}

export interface SubscribeInfoResponse {
  trackingId?: string;
  infoSubscriptions?: InfoSubscription[];
}

export interface LastPriceSubscription {
  figi?: string;
  subscriptionStatus?: SubscriptionStatus;
  instrumentUid?: string;
  streamId?: string;
  subscriptionId?: string;
  subscriptionAction?: SubscriptionAction;
  ticker?: string;
  classCode?: string;
}

export interface SubscribeLastPriceResponse {
  trackingId?: string;
  lastPriceSubscriptions?: LastPriceSubscription[];
}

export interface Order {
  price?: Quotation;
  quantity?: string;               // int64
}

export interface StreamCandle {
  figi?: string;
  interval?: SubscriptionInterval;
  open?: Quotation;
  high?: Quotation;
  low?: Quotation;
  close?: Quotation;
  volume?: string;                 // int64
  time?: Timestamp;
  lastTradeTs?: Timestamp;
  instrumentUid?: string;
  ticker?: string;
  classCode?: string;
  volumeBuy?: string;              // int64
  volumeSell?: string;             // int64
  candleSourceType?: CandleSource;
}

export interface StreamTrade {
  figi?: string;
  direction?: TradeDirection;
  price?: Quotation;
  quantity?: string;               // int64
  time?: Timestamp;
  instrumentUid?: string;
  tradeSource?: TradeSourceType;
  ticker?: string;
  classCode?: string;
}

export interface StreamOrderBook {
  figi?: string;
  depth?: number;
  isConsistent?: boolean;
  bids?: Order[];
  asks?: Order[];
  time?: Timestamp;
  limitUp?: Quotation;
  limitDown?: Quotation;
  instrumentUid?: string;
  orderBookType?: OrderBookType;
  ticker?: string;
  classCode?: string;
}

export interface StreamTradingStatus {
  figi?: string;
  tradingStatus?: string;          // SecurityTradingStatus (значения строковые)
  time?: Timestamp;
  limitOrderAvailableFlag?: boolean;
  marketOrderAvailableFlag?: boolean;
  instrumentUid?: string;
  ticker?: string;
  classCode?: string;
}

export interface StreamLastPrice {
  figi?: string;
  price?: Quotation;
  time?: Timestamp;
  ticker?: string;
  classCode?: string;
  instrumentUid?: string;
  lastPriceType?: LastPriceType;
}

export interface StreamOpenInterest {
  instrumentUid?: string;
  time?: Timestamp;
  openInterest?: string;           // int64
  ticker?: string;
  classCode?: string;
}

export interface StreamPing {
  time?: Timestamp;
  streamId?: string;
  pingRequestTime?: Timestamp;
}

// Общий тип ответа
export type MarketDataResponse = {
  subscribeCandlesResponse?: SubscribeCandlesResponse;
  subscribeOrderBookResponse?: SubscribeOrderBookResponse;
  subscribeTradesResponse?: SubscribeTradesResponse;
  subscribeInfoResponse?: SubscribeInfoResponse;
  subscribeLastPriceResponse?: SubscribeLastPriceResponse;
  candle?: StreamCandle;
  trade?: StreamTrade;
  orderbook?: StreamOrderBook;
  tradingStatus?: StreamTradingStatus;
  ping?: StreamPing;
  lastPrice?: StreamLastPrice;
  openInterest?: StreamOpenInterest;
};