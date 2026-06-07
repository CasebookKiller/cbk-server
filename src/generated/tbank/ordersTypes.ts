import type { MoneyValue, Quotation, Timestamp } from '../commonTypes';

// 1.

/** Тип идентификатора заявки */
export enum OrderIdType {
  /** Тип идентификатора не указан */
  ORDER_ID_TYPE_UNSPECIFIED = 0,
  /** Биржевой идентификатор */
  ORDER_ID_TYPE_EXCHANGE = 1,
  /** Ключ идемпотентности, переданный клиентом */
  ORDER_ID_TYPE_REQUEST = 2,
}

/** Запрос отмены торгового поручения */
export interface CancelOrderRequest {
  /** Номер счета */
  accountId?: string;
  /** Идентификатор заявки */
  orderId?: string;
  /** Тип идентификатора заявки */
  orderIdType?: OrderIdType;
}

/** Метаданные ответа */
export interface ResponseMetadata {
  /** Идентификатор трекинга */
  trackingId?: string;
  /** Серверное время */
  serverTime?: Timestamp;
}

/** Результат отмены торгового поручения */
export interface CancelOrderResponse {
  /** Дата и время отмены заявки в часовом поясе UTC */
  time?: Timestamp;
  /** Метадата */
  responseMetadata?: ResponseMetadata;
}

// 2.

/** Запрос на расчет количества доступных для покупки/продажи лотов */
export interface GetMaxLotsRequest {
  /** Номер счета */
  accountId?: string;
  /** Идентификатор инструмента (figi или instrument_uid) */
  instrumentId?: string;
  /** Цена инструмента (опционально) */
  price?: Quotation;               // Quotation уже определён в common-types
}

/** Лимиты для покупок */
export interface BuyLimitsView {
  /** Количество доступной валюты для покупки */
  buyMoneyAmount?: Quotation;
  /** Максимальное доступное количество лотов для покупки */
  buyMaxLots?: number;
  /** Максимальное доступное количество лотов для покупки для заявки по рыночной цене на текущий момент */
  buyMaxMarketLots?: number;
}

/** Лимиты для продаж */
export interface SellLimitsView {
  /** Максимальное доступное количество лотов для продажи */
  sellMaxLots?: number;
}

/** Результат количества доступных для покупки/продажи лотов */
export interface GetMaxLotsResponse {
  /** Валюта инструмента */
  currency?: string;
  /** Лимиты для покупок на собственные деньги */
  buyLimits?: BuyLimitsView;
  /** Лимиты для покупок с учетом маржинального кредитования */
  buyMarginLimits?: BuyLimitsView;
  /** Лимиты для продаж по собственной позиции */
  sellLimits?: SellLimitsView;
  /** Лимиты для продаж с учетом маржинального кредитования */
  sellMarginLimits?: SellLimitsView;
}

// 3.

/** Направление операции */
export enum OrderDirection {
  /** Значение не указано */
  ORDER_DIRECTION_UNSPECIFIED = 0,
  /** Покупка */
  ORDER_DIRECTION_BUY = 1,
  /** Продажа */
  ORDER_DIRECTION_SELL = 2,
}

/** Запрос получения предварительной стоимости заявки */
export interface GetOrderPriceRequest {
  /** Номер счета */
  accountId?: string;
  /** Идентификатор инструмента (figi или instrument_uid) */
  instrumentId?: string;
  /** Цена инструмента */
  price?: Quotation;
  /** Направление заявки */
  direction?: OrderDirection;
  /** Количество лотов */
  quantity?: number;
}

/** Дополнительная информация по облигациям */
export interface ExtraBond {
  /** Значение НКД (накопленного купонного дохода) на дату */
  aciValue?: MoneyValue;
  /** Курс конвертации для замещающих облигаций */
  nominalConversionRate?: Quotation;
}

/** Дополнительная информация по фьючерсам */
export interface ExtraFuture {
  /** Гарантийное обеспечение для фьючерса */
  initialMargin?: MoneyValue;
}

/** Предварительная стоимость заявки */
export interface GetOrderPriceResponse {
  /** Итоговая стоимость заявки */
  totalOrderAmount?: MoneyValue;
  /** Стоимость заявки без комиссий, НКД, ГО */
  initialOrderAmount?: MoneyValue;
  /** Запрошено лотов */
  lotsRequested?: number;
  /** Общая комиссия */
  executedCommission?: MoneyValue;
  /** Общая комиссия в рублях */
  executedCommissionRub?: MoneyValue;
  /** Сервисная комиссия */
  serviceCommission?: MoneyValue;
  /** Комиссия за проведение сделки */
  dealCommission?: MoneyValue;
  /** Доп. информация по облигациям */
  extraBond?: ExtraBond;
  /** Доп. информация по фьючерсам */
  extraFuture?: ExtraFuture;
}

// 4.

/** Статус исполнения заявки */
export enum OrderExecutionReportStatus {
  EXECUTION_REPORT_STATUS_UNSPECIFIED = 0,
  /** Исполнена */
  EXECUTION_REPORT_STATUS_FILL = 1,
  /** Отклонена */
  EXECUTION_REPORT_STATUS_REJECTED = 2,
  /** Отменена пользователем */
  EXECUTION_REPORT_STATUS_CANCELLED = 3,
  /** Новая */
  EXECUTION_REPORT_STATUS_NEW = 4,
  /** Частично исполнена */
  EXECUTION_REPORT_STATUS_PARTIALLYFILL = 5,
}

/** Тип заявки */
export enum OrderType {
  /** Значение не указано */
  ORDER_TYPE_UNSPECIFIED = 0,
  /** Лимитная */
  ORDER_TYPE_LIMIT = 1,
  /** Рыночная */
  ORDER_TYPE_MARKET = 2,
  /** Лучшая цена */
  ORDER_TYPE_BESTPRICE = 3,
}

/** Фильтры для запроса списка заявок */
export interface GetOrdersRequestFilters {
  /** Начало периода (UTC) */
  from?: Timestamp;
  /** Окончание периода (UTC) */
  to?: Timestamp;
  /** Статусы заявок */
  executionStatus?: OrderExecutionReportStatus[];
}

/** Запрос списка активных заявок */
export interface GetOrdersRequest {
  /** Номер счета */
  accountId?: string;
  /** Дополнительные фильтры */
  advancedFilters?: GetOrdersRequestFilters;
}

/** Сделка в рамках торгового поручения */
export interface OrderStage {
  /** Цена за 1 инструмент */
  price?: MoneyValue;
  /** Количество лотов */
  quantity?: number;
  /** Идентификатор сделки */
  tradeId?: string;
  /** Время исполнения */
  executionTime?: Timestamp;
}

/** Информация о торговом поручении */
export interface OrderState {
  /** Биржевой идентификатор заявки */
  orderId?: string;
  /** Текущий статус заявки */
  executionReportStatus?: OrderExecutionReportStatus;
  /** Запрошено лотов */
  lotsRequested?: number;
  /** Исполнено лотов */
  lotsExecuted?: number;
  /** Начальная цена заявки */
  initialOrderPrice?: MoneyValue;
  /** Исполненная цена заявки */
  executedOrderPrice?: MoneyValue;
  /** Итоговая стоимость заявки */
  totalOrderAmount?: MoneyValue;
  /** Средняя цена позиции по сделке */
  averagePositionPrice?: MoneyValue;
  /** Начальная комиссия */
  initialCommission?: MoneyValue;
  /** Фактическая комиссия */
  executedCommission?: MoneyValue;
  /** FIGI-идентификатор инструмента */
  figi?: string;
  /** Направление заявки (используем существующий OrderDirection) */
  direction?: OrderDirection;
  /** Начальная цена за 1 инструмент */
  initialSecurityPrice?: MoneyValue;
  /** Стадии выполнения */
  stages?: OrderStage[];
  /** Сервисная комиссия */
  serviceCommission?: MoneyValue;
  /** Валюта заявки */
  currency?: string;
  /** Тип заявки */
  orderType?: OrderType;
  /** Дата и время выставления заявки (UTC) */
  orderDate?: Timestamp;
  /** UID инструмента */
  instrumentUid?: string;
  /** Ключ идемпотентности */
  orderRequestId?: string;
  /** Тикер */
  ticker?: string;
  /** Класс-код */
  classCode?: string;
}

/** Список активных заявок */
export interface GetOrdersResponse {
  /** Массив заявок */
  orders?: OrderState[];
}

// 5.

/** Тип цены */
export enum PriceType {
  /** Значение не определено */
  PRICE_TYPE_UNSPECIFIED = 0,
  /** Цена в пунктах (для фьючерсов и облигаций) */
  PRICE_TYPE_POINT = 1,
  /** Цена в валюте расчетов по инструменту */
  PRICE_TYPE_CURRENCY = 2,
}

/** Запрос получения статуса торгового поручения */
export interface GetOrderStateRequest {
  /** Номер счета */
  accountId?: string;
  /** Идентификатор заявки */
  orderId?: string;
  /** Тип цены */
  priceType?: PriceType;
  /** Тип идентификатора заявки (опционально) */
  orderIdType?: OrderIdType;
}

// 6.

/** Алгоритм исполнения заявки */
export enum TimeInForceType {
  /** Значение не определено */
  TIME_IN_FORCE_UNSPECIFIED = 0,
  /** Заявка действует до конца торгового дня (по умолчанию) */
  TIME_IN_FORCE_DAY = 1,
  /** Исполнить или отменить (частичное исполнение возможно) */
  TIME_IN_FORCE_FILL_AND_KILL = 2,
  /** Полное исполнение или немедленная отмена (для срочного рынка и выходных недоступно) */
  TIME_IN_FORCE_FILL_OR_KILL = 3,
}

/** Запрос выставления торгового поручения */
export interface PostOrderRequest {
  /** FIGI-идентификатор (deprecated) */
  figi?: string;
  /** Количество лотов */
  quantity?: number;
  /** Цена за 1 инструмент (игнорируется для рыночных) */
  price?: Quotation;
  /** Направление операции */
  direction?: OrderDirection;
  /** Номер счета */
  accountId?: string;
  /** Тип заявки */
  orderType?: OrderType;
  /** Идентификатор запроса (идемпотентность), макс 36 символов */
  orderId?: string;
  /** Идентификатор инструмента */
  instrumentId?: string;
  /** Алгоритм исполнения */
  timeInForce?: TimeInForceType;
  /** Тип цены */
  priceType?: PriceType;
  /** Согласие на непокрытую позицию */
  confirmMarginTrade?: boolean;
}

/** Информация о выставлении поручения */
export interface PostOrderResponse {
  /** Биржевой идентификатор заявки */
  orderId?: string;
  /** Текущий статус */
  executionReportStatus?: OrderExecutionReportStatus;
  /** Запрошено лотов */
  lotsRequested?: number;
  /** Исполнено лотов */
  lotsExecuted?: number;
  /** Начальная цена заявки */
  initialOrderPrice?: MoneyValue;
  /** Исполненная средняя цена одного инструмента */
  executedOrderPrice?: MoneyValue;
  /** Итоговая стоимость с комиссиями */
  totalOrderAmount?: MoneyValue;
  /** Начальная комиссия */
  initialCommission?: MoneyValue;
  /** Фактическая комиссия */
  executedCommission?: MoneyValue;
  /** НКД */
  aciValue?: MoneyValue;
  /** FIGI */
  figi?: string;
  /** Направление */
  direction?: OrderDirection;
  /** Начальная цена за 1 инструмент */
  initialSecurityPrice?: MoneyValue;
  /** Тип заявки */
  orderType?: OrderType;
  /** Дополнительные данные */
  message?: string;
  /** Начальная цена в пунктах (для фьючерсов) */
  initialOrderPricePt?: Quotation;
  /** UID инструмента */
  instrumentUid?: string;
  /** Тикер */
  ticker?: string;
  /** Класс-код */
  classCode?: string;
  /** Ключ идемпотентности */
  orderRequestId?: string;
  /** Метадата */
  responseMetadata?: ResponseMetadata;
}

// 7.

/** Запрос выставления асинхронного торгового поручения */
export interface PostOrderAsyncRequest {
  /** Идентификатор инструмента (figi или instrument_uid) */
  instrumentId?: string;
  /** Количество лотов */
  quantity?: number;
  /** Цена за 1 инструмент (игнорируется для рыночных) */
  price?: Quotation;
  /** Направление операции */
  direction?: OrderDirection;
  /** Номер счета */
  accountId?: string;
  /** Тип заявки */
  orderType?: OrderType;
  /** Идентификатор запроса (идемпотентность), макс 36 символов */
  orderId?: string;
  /** Алгоритм исполнения (опционально) */
  timeInForce?: TimeInForceType;
  /** Тип цены (опционально) */
  priceType?: PriceType;
  /** Согласие на непокрытую позицию */
  confirmMarginTrade?: boolean;
}

/** Результат выставления асинхронного торгового поручения */
export interface PostOrderAsyncResponse {
  /** Идентификатор ключа идемпотентности */
  orderRequestId?: string;
  /** Текущий статус заявки */
  executionReportStatus?: OrderExecutionReportStatus;
  /** Идентификатор торгового поручения (опционально) */
  tradeIntentId?: string;
}

// 8.

/** Запрос изменения выставленной заявки */
export interface ReplaceOrderRequest {
  /** Номер счета */
  accountId?: string;
  /** Идентификатор заявки на бирже */
  orderId?: string;
  /** Новый ключ идемпотентности (макс 36 символов) */
  idempotencyKey?: string;
  /** Количество лотов */
  quantity?: number;
  /** Цена за 1 инструмент (опционально) */
  price?: Quotation;
  /** Тип цены */
  priceType?: PriceType;
  /** Согласие на непокрытую позицию */
  confirmMarginTrade?: boolean;
}