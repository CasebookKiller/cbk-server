import type { Timestamp, MoneyValue, Quotation, ResponseMetadata } from '../commonTypes';
import { PriceType } from './ordersTypes';

// ---------- Перечисления ----------

export enum StopOrderStatusOption {
  STOP_ORDER_STATUS_UNSPECIFIED = 0,
  STOP_ORDER_STATUS_ALL = 1,
  STOP_ORDER_STATUS_ACTIVE = 2,
  STOP_ORDER_STATUS_EXECUTED = 3,
  STOP_ORDER_STATUS_CANCELED = 4,
  STOP_ORDER_STATUS_EXPIRED = 5,
}

export enum StopOrderDirection {
  STOP_ORDER_DIRECTION_UNSPECIFIED = 0,
  STOP_ORDER_DIRECTION_BUY = 1,
  STOP_ORDER_DIRECTION_SELL = 2,
}

export enum StopOrderType {
  STOP_ORDER_TYPE_UNSPECIFIED = 0,
  STOP_ORDER_TYPE_TAKE_PROFIT = 1,
  STOP_ORDER_TYPE_STOP_LOSS = 2,
  STOP_ORDER_TYPE_STOP_LIMIT = 3,
}

export enum TakeProfitType {
  TAKE_PROFIT_TYPE_UNSPECIFIED = 0,
  TAKE_PROFIT_TYPE_REGULAR = 1,
  TAKE_PROFIT_TYPE_TRAILING = 2,
}

export enum TrailingValueType {
  TRAILING_VALUE_UNSPECIFIED = 0,
  TRAILING_VALUE_ABSOLUTE = 1,
  TRAILING_VALUE_RELATIVE = 2,
}

export enum TrailingStopStatus {
  TRAILING_STOP_UNSPECIFIED = 0,
  TRAILING_STOP_ACTIVE = 1,
  TRAILING_STOP_ACTIVATED = 2,
}

export enum ExchangeOrderType {
  EXCHANGE_ORDER_TYPE_UNSPECIFIED = 0,
  EXCHANGE_ORDER_TYPE_MARKET = 1,
  EXCHANGE_ORDER_TYPE_LIMIT = 2,
}

export enum StopOrderExpirationType {
  STOP_ORDER_EXPIRATION_TYPE_UNSPECIFIED = 0,
  STOP_ORDER_EXPIRATION_TYPE_GOOD_TILL_CANCEL = 1,
  STOP_ORDER_EXPIRATION_TYPE_GOOD_TILL_DATE = 2,
}

// ---------- Интерфейсы запросов и ответов ----------

export interface CancelStopOrderRequest {
  accountId?: string;
  stopOrderId?: string;
}

export interface CancelStopOrderResponse {
  time?: Timestamp;
}

export interface GetStopOrdersRequest {
  accountId?: string;
  status?: StopOrderStatusOption;
  from?: Timestamp;
  to?: Timestamp;
}

export interface TrailingData {
  indent?: Quotation;
  indentType?: TrailingValueType;
  spread?: Quotation;
  spreadType?: TrailingValueType;
  status?: TrailingStopStatus;
  price?: Quotation;
  extr?: Quotation;
}

export interface StopOrder {
  stopOrderId?: string;
  lotsRequested?: number;
  figi?: string;
  direction?: StopOrderDirection;
  currency?: string;
  orderType?: StopOrderType;
  createDate?: Timestamp;
  activationDateTime?: Timestamp;
  expirationTime?: Timestamp;
  price?: MoneyValue;
  stopPrice?: MoneyValue;
  instrumentUid?: string;
  takeProfitType?: TakeProfitType;
  trailingData?: TrailingData;
  status?: StopOrderStatusOption;
  exchangeOrderType?: ExchangeOrderType;
  exchangeOrderId?: string;
  ticker?: string;
  classCode?: string;
}

export interface GetStopOrdersResponse {
  stopOrders?: StopOrder[];
}

export interface PostStopOrderRequest {
  figi?: string;
  quantity?: number;
  price?: Quotation;
  stopPrice?: Quotation;
  direction?: StopOrderDirection;
  accountId?: string;
  expirationType?: StopOrderExpirationType;
  stopOrderType?: StopOrderType;
  expireDate?: Timestamp;
  instrumentId?: string;
  exchangeOrderType?: ExchangeOrderType;
  takeProfitType?: TakeProfitType;
  trailingData?: TrailingData;
  priceType?: PriceType;        // PriceType из common-types (если нет, добавим)
  orderId?: string;
  confirmMarginTrade?: boolean;
}

export interface PostStopOrderResponse {
  stopOrderId?: string;
  orderRequestId?: string;
  responseMetadata?: ResponseMetadata;
}