import type { MoneyValue, Quotation, Timestamp } from '../commonTypes'; // или путь к вашим общим типам

// ==================== Перечисления ====================

/** Статус запрашиваемых операций. */
export enum OperationState {
  /** Статус операции не определён. */
  OPERATION_STATE_UNSPECIFIED = 0,
  /** Исполнена частично или полностью. */
  OPERATION_STATE_EXECUTED = 1,
  /** Отменена. */
  OPERATION_STATE_CANCELED = 2,
  /** Исполняется. */
  OPERATION_STATE_PROGRESS = 3,
}

/** Тип операции. */
export enum OperationType {
  /** Тип операции не определён. */
  OPERATION_TYPE_UNSPECIFIED = 0,
  /** Пополнение брокерского счета. */
  OPERATION_TYPE_INPUT = 1,
  /** Удержание НДФЛ по купонам. */
  OPERATION_TYPE_BOND_TAX = 2,
  /** Вывод ЦБ. */
  OPERATION_TYPE_OUTPUT_SECURITIES = 3,
  /** Доход по сделке РЕПО овернайт. */
  OPERATION_TYPE_OVERNIGHT = 4,
  /** Удержание налога. */
  OPERATION_TYPE_TAX = 5,
  /** Полное погашение облигаций. */
  OPERATION_TYPE_BOND_REPAYMENT_FULL = 6,
  /** Продажа ЦБ с карты. */
  OPERATION_TYPE_SELL_CARD = 7,
  /** Удержание налога по дивидендам. */
  OPERATION_TYPE_DIVIDEND_TAX = 8,
  /** Вывод денежных средств. */
  OPERATION_TYPE_OUTPUT = 9,
  /** Частичное погашение облигаций. */
  OPERATION_TYPE_BOND_REPAYMENT = 10,
  /** Корректировка налога. */
  OPERATION_TYPE_TAX_CORRECTION = 11,
  /** Удержание комиссии за обслуживание брокерского счета. */
  OPERATION_TYPE_SERVICE_FEE = 12,
  /** Удержание налога за материальную выгоду. */
  OPERATION_TYPE_BENEFIT_TAX = 13,
  /** Удержание комиссии за непокрытую позицию. */
  OPERATION_TYPE_MARGIN_FEE = 14,
  /** Покупка ЦБ. */
  OPERATION_TYPE_BUY = 15,
  /** Покупка ЦБ с карты. */
  OPERATION_TYPE_BUY_CARD = 16,
  /** Перевод ценных бумаг из другого депозитария. */
  OPERATION_TYPE_INPUT_SECURITIES = 17,
  /** Продажа в результате Margin-call. */
  OPERATION_TYPE_SELL_MARGIN = 18,
  /** Удержание комиссии за операцию. */
  OPERATION_TYPE_BROKER_FEE = 19,
  /** Покупка в результате Margin-call. */
  OPERATION_TYPE_BUY_MARGIN = 20,
  /** Выплата дивидендов. */
  OPERATION_TYPE_DIVIDEND = 21,
  /** Продажа ЦБ. */
  OPERATION_TYPE_SELL = 22,
  /** Выплата купонов. */
  OPERATION_TYPE_COUPON = 23,
  /** Удержание комиссии SuccessFee. */
  OPERATION_TYPE_SUCCESS_FEE = 24,
  /** Передача дивидендного дохода. */
  OPERATION_TYPE_DIVIDEND_TRANSFER = 25,
  /** Зачисление вариационной маржи. */
  OPERATION_TYPE_ACCRUING_VARMARGIN = 26,
  /** Списание вариационной маржи. */
  OPERATION_TYPE_WRITING_OFF_VARMARGIN = 27,
  /** Покупка в рамках экспирации фьючерсного контракта. */
  OPERATION_TYPE_DELIVERY_BUY = 28,
  /** Продажа в рамках экспирации фьючерсного контракта. */
  OPERATION_TYPE_DELIVERY_SELL = 29,
  /** Комиссия за управление по счету автоследования. */
  OPERATION_TYPE_TRACK_MFEE = 30,
  /** Комиссия за результат по счету автоследования. */
  OPERATION_TYPE_TRACK_PFEE = 31,
  /** Удержание налога по ставке 15%. */
  OPERATION_TYPE_TAX_PROGRESSIVE = 32,
  /** Удержание налога по купонам по ставке 15%. */
  OPERATION_TYPE_BOND_TAX_PROGRESSIVE = 33,
  /** Удержание налога по дивидендам по ставке 15%. */
  OPERATION_TYPE_DIVIDEND_TAX_PROGRESSIVE = 34,
  /** Удержание налога за материальную выгоду по ставке 15%. */
  OPERATION_TYPE_BENEFIT_TAX_PROGRESSIVE = 35,
  /** Корректировка налога по ставке 15%. */
  OPERATION_TYPE_TAX_CORRECTION_PROGRESSIVE = 36,
  /** Удержание налога за возмещение по сделкам РЕПО по ставке 15%. */
  OPERATION_TYPE_TAX_REPO_PROGRESSIVE = 37,
  /** Удержание налога за возмещение по сделкам РЕПО. */
  OPERATION_TYPE_TAX_REPO = 38,
  /** Удержание налога по сделкам РЕПО. */
  OPERATION_TYPE_TAX_REPO_HOLD = 39,
  /** Возврат налога по сделкам РЕПО. */
  OPERATION_TYPE_TAX_REPO_REFUND = 40,
  /** Удержание налога по сделкам РЕПО по ставке 15%. */
  OPERATION_TYPE_TAX_REPO_HOLD_PROGRESSIVE = 41,
  /** Возврат налога по сделкам РЕПО по ставке 15%. */
  OPERATION_TYPE_TAX_REPO_REFUND_PROGRESSIVE = 42,
  /** Выплата дивидендов на карту. */
  OPERATION_TYPE_DIV_EXT = 43,
  /** Корректировка налога по купонам. */
  OPERATION_TYPE_TAX_CORRECTION_COUPON = 44,
  /** Комиссия за валютный остаток. */
  OPERATION_TYPE_CASH_FEE = 45,
  /** Комиссия за вывод валюты с брокерского счета. */
  OPERATION_TYPE_OUT_FEE = 46,
  /** Гербовый сбор. */
  OPERATION_TYPE_OUT_STAMP_DUTY = 47,
  /** SWIFT-перевод. */
  OPERATION_TYPE_OUTPUT_SWIFT = 50,
  /** SWIFT-перевод. */
  OPERATION_TYPE_INPUT_SWIFT = 51,
  /** Перевод на карту. */
  OPERATION_TYPE_OUTPUT_ACQUIRING = 53,
  /** Перевод с карты. */
  OPERATION_TYPE_INPUT_ACQUIRING = 54,
  /** Комиссия за вывод средств. */
  OPERATION_TYPE_OUTPUT_PENALTY = 55,
  /** Списание оплаты за сервис Советов. */
  OPERATION_TYPE_ADVICE_FEE = 56,
  /** Перевод ценных бумаг с ИИС на брокерский счет. */
  OPERATION_TYPE_TRANS_IIS_BS = 57,
  /** Перевод ценных бумаг с одного брокерского счета на другой. */
  OPERATION_TYPE_TRANS_BS_BS = 58,
  /** Вывод денежных средств со счета. */
  OPERATION_TYPE_OUT_MULTI = 59,
  /** Пополнение денежных средств со счета. */
  OPERATION_TYPE_INP_MULTI = 60,
  /** Размещение биржевого овернайта. */
  OPERATION_TYPE_OVER_PLACEMENT = 61,
  /** Списание комиссии. */
  OPERATION_TYPE_OVER_COM = 62,
  /** Доход от овернайта. */
  OPERATION_TYPE_OVER_INCOME = 63,
  /** Экспирация опциона. */
  OPERATION_TYPE_OPTION_EXPIRATION = 64,
  /** Экспирация фьючерса. */
  OPERATION_TYPE_FUTURE_EXPIRATION = 65,
  /** Прочие комиссии. */
  OPERATION_TYPE_OTHER_FEE = 66,
  /** Операция по счету. */
  OPERATION_TYPE_OTHER = 67,
  /** Погашение ЦФА-токена. */
  OPERATION_TYPE_DFA_REDEMPTION = 68,
  /** Отмена заявки на первичное размещение по ЦФА. */
  OPERATION_TYPE_PRIMARY_ORDER = 69,
}

/** Тип инструмента. */
export enum InstrumentType {
  INSTRUMENT_TYPE_UNSPECIFIED = 0,
  /** Облигация. */
  INSTRUMENT_TYPE_BOND = 1,
  /** Акция. */
  INSTRUMENT_TYPE_SHARE = 2,
  /** Валюта. */
  INSTRUMENT_TYPE_CURRENCY = 3,
  /** Exchange-traded fund. Фонд. */
  INSTRUMENT_TYPE_ETF = 4,
  /** Фьючерс. */
  INSTRUMENT_TYPE_FUTURES = 5,
  /** Структурная нота. */
  INSTRUMENT_TYPE_SP = 6,
  /** Опцион. */
  INSTRUMENT_TYPE_OPTION = 7,
  /** Clearing certificate. */
  INSTRUMENT_TYPE_CLEARING_CERTIFICATE = 8,
  /** Индекс. */
  INSTRUMENT_TYPE_INDEX = 9,
  /** Товар. */
  INSTRUMENT_TYPE_COMMODITY = 10,
}

/** Валюта, в которой нужно рассчитать портфель. */
export enum CurrencyRequest {
  /** Рубли. */
  RUB = 0,
  /** Доллары. */
  USD = 1,
  /** Евро. */
  EUR = 2,
}

// ==================== Запросы / Ответы ====================

// --- BrokerReport ---

export interface GenerateBrokerReportRequest {
  /** Идентификатор счета клиента. */
  accountId?: string;
  /** Начало периода по UTC. */
  from?: Timestamp;
  /** Окончание периода по UTC. */
  to?: Timestamp;
}

export interface GetBrokerReportRequestObj {
  /** Идентификатор задачи формирования брокерского отчета. */
  taskId?: string;
  /** Номер страницы отчета, начинается с 1. Значение по умолчанию — 0. */
  page?: number;
}

export interface BrokerReportRequest {
  /** Запрос на генерацию отчёта. */
  generateBrokerReportRequest?: GenerateBrokerReportRequest;
  /** Запрос на получение отчёта по задаче. */
  getBrokerReportRequest?: GetBrokerReportRequestObj;
}

export interface GenerateBrokerReportResponse {
  /** Идентификатор задачи формирования брокерского отчета. */
  taskId?: string;
}

export interface BrokerReport {
  /** Номер сделки. */
  tradeId?: string;
  /** Номер поручения. */
  orderId?: string;
  /** FIGI-идентификатор инструмента. */
  figi?: string;
  /** Признак исполнения. */
  executeSign?: string;
  /** Дата и время заключения по UTC. */
  tradeDatetime?: Timestamp;
  /** Торговая площадка. */
  exchange?: string;
  /** Режим торгов. */
  classCode?: string;
  /** Вид сделки. */
  direction?: string;
  /** Сокращённое наименование актива. */
  name?: string;
  /** Код актива. */
  ticker?: string;
  /** Цена за единицу. */
  price?: MoneyValue;
  /** Количество. */
  quantity?: number;
  /** Сумма без НКД. */
  orderAmount?: MoneyValue;
  /** НКД. */
  aciValue?: Quotation;
  /** Сумма сделки. */
  totalOrderAmount?: MoneyValue;
  /** Комиссия брокера. */
  brokerCommission?: MoneyValue;
  /** Комиссия биржи. */
  exchangeCommission?: MoneyValue;
  /** Комиссия клирингового центра. */
  exchangeClearingCommission?: MoneyValue;
  /** Ставка РЕПО, %. */
  repoRate?: Quotation;
  /** Контрагент или брокер. */
  party?: string;
  /** Дата расчетов по UTC. */
  clearValueDate?: Timestamp;
  /** Дата поставки по UTC. */
  secValueDate?: Timestamp;
  /** Статус брокера. */
  brokerStatus?: string;
  /** Тип договора. */
  separateAgreementType?: string;
  /** Номер договора. */
  separateAgreementNumber?: string;
  /** Дата договора. */
  separateAgreementDate?: string;
  /** Тип расчета по сделке. */
  deliveryType?: string;
}

export interface GetBrokerReportResponse {
  /** Список записей отчёта. */
  brokerReport?: BrokerReport[];
  /** Количество записей в отчете. */
  itemsCount?: number;
  /** Количество страниц с данными отчета, начинается с 0. */
  pagesCount?: number;
  /** Текущая страница, начинается с 0. */
  page?: number;
}

export interface BrokerReportResponse {
  /** Ответ на генерацию отчёта. */
  generateBrokerReportResponse?: GenerateBrokerReportResponse;
  /** Ответ с готовым отчётом. */
  getBrokerReportResponse?: GetBrokerReportResponse;
}

// --- DividendsForeignIssuer ---

export interface GenerateDividendsForeignIssuerReportRequest {
  accountId?: string;
  from?: Timestamp;
  to?: Timestamp;
}

export interface GetDividendsForeignIssuerReportRequest {
  taskId?: string;
  page?: number;
}

export interface GetDividendsForeignIssuerRequest {
  generateDivForeignIssuerReport?: GenerateDividendsForeignIssuerReportRequest;
  getDivForeignIssuerReport?: GetDividendsForeignIssuerReportRequest;
}

export interface GenerateDividendsForeignIssuerReportResponse {
  taskId?: string;
}

export interface DividendsForeignIssuerReport {
  /** Дата фиксации реестра. */
  recordDate?: Timestamp;
  /** Дата выплаты. */
  paymentDate?: Timestamp;
  /** Наименование ценной бумаги. */
  securityName?: string;
  /** ISIN-идентификатор ценной бумаги. */
  isin?: string;
  /** Страна эмитента. */
  issuerCountry?: string;
  /** Количество ценных бумаг. */
  quantity?: number;
  /** Выплаты на одну бумагу. */
  dividend?: Quotation;
  /** Комиссия внешних платежных агентов. */
  externalCommission?: Quotation;
  /** Сумма до удержания налога. */
  dividendGross?: Quotation;
  /** Сумма налога, удержанного агентом. */
  tax?: Quotation;
  /** Итоговая сумма выплаты. */
  dividendAmount?: Quotation;
  /** Валюта. */
  currency?: string;
}

export interface GetDividendsForeignIssuerReportResponse {
  dividendsForeignIssuerReport?: DividendsForeignIssuerReport[];
  itemsCount?: number;
  pagesCount?: number;
  page?: number;
}

export interface GetDividendsForeignIssuerResponse {
  generateDivForeignIssuerReportResponse?: GenerateDividendsForeignIssuerReportResponse;
  divForeignIssuerReport?: GetDividendsForeignIssuerReportResponse;
}

// --- Operations ---

export interface OperationsRequest {
  /** Идентификатор счета клиента. */
  accountId?: string;
  /** Начало периода по UTC. */
  from?: Timestamp;
  /** Окончание периода по UTC. */
  to?: Timestamp;
  /** Статус запрашиваемых операций. */
  state?: OperationState;
  /** FIGI-идентификатор инструмента для фильтрации. */
  figi?: string;
}

export interface OperationTrade {
  /** Идентификатор сделки. */
  tradeId?: string;
  /** Дата и время сделки по UTC. */
  dateTime?: Timestamp;
  /** Количество инструментов. */
  quantity?: number;
  /** Цена за 1 инструмент. */
  price?: MoneyValue;
}

export interface ChildOperationItem {
  /** Уникальный идентификатор инструмента. */
  instrumentUid?: string;
  /** Сумма операции. */
  payment?: MoneyValue;
}

export interface Operation {
  /** Идентификатор операции. */
  id?: string;
  /** Идентификатор родительской операции. */
  parentOperationId?: string;
  /** Валюта операции. */
  currency?: string;
  /** Сумма операции. */
  payment?: MoneyValue;
  /** Цена операции за 1 инструмент. */
  price?: MoneyValue;
  /** Статус операции. */
  state?: OperationState;
  /** Количество единиц инструмента. */
  quantity?: number;
  /** Неисполненный остаток по сделке. */
  quantityRest?: number;
  /** FIGI-идентификатор инструмента. */
  figi?: string;
  /** Тип инструмента. */
  instrumentType?: string;
  /** Дата и время операции в UTC. */
  date?: Timestamp;
  /** Текстовое описание типа операции. */
  type?: string;
  /** Тип операции. */
  operationType?: OperationType;
  /** Массив сделок. */
  trades?: OperationTrade[];
  /** Идентификатор актива. */
  assetUid?: string;
  /** Уникальный идентификатор позиции. */
  positionUid?: string;
  /** Уникальный идентификатор инструмента. */
  instrumentUid?: string;
  /** Массив дочерних операций. */
  childOperations?: ChildOperationItem[];
}

export interface OperationsResponse {
  /** Массив операций. */
  operations?: Operation[];
}

// --- OperationsByCursor ---

export interface GetOperationsByCursorRequest {
  /** Идентификатор счета клиента, обязательный параметр. */
  accountId?: string;
  /** Идентификатор инструмента — FIGI или UID. */
  instrumentId?: string;
  /** Начало периода по UTC. */
  from?: Timestamp;
  /** Окончание периода по UTC. */
  to?: Timestamp;
  /** Идентификатор элемента, с которого начать формировать ответ. */
  cursor?: string;
  /** Лимит количества операций. По умолчанию — `100`, максимальное значение — `1000`. */
  limit?: number;
  /** Типы операций. */
  operationTypes?: OperationType[];
  /** Статус запрашиваемых операций. */
  state?: OperationState;
  /** Флаг возврата комиссии. */
  withoutCommissions?: boolean;
  /** Флаг получения ответа без массива сделок. */
  withoutTrades?: boolean;
  /** Флаг показа overnight операций. */
  withoutOvernights?: boolean;
}

export interface OperationItemTrade {
  /** Номер сделки. */
  num?: string;
  /** Дата сделки. */
  date?: Timestamp;
  /** Количество в единицах. */
  quantity?: number;
  /** Цена. */
  price?: MoneyValue;
  /** Доходность. */
  yield?: MoneyValue;
  /** Относительная доходность. */
  yieldRelative?: Quotation;
}

export interface OperationItemTrades {
  trades?: OperationItemTrade[];
}

export interface OperationItem {
  /** Курсор. */
  cursor?: string;
  /** Номер счета клиента. */
  brokerAccountId?: string;
  /** Идентификатор операции. */
  id?: string;
  /** Идентификатор родительской операции. */
  parentOperationId?: string;
  /** Название операции. */
  name?: string;
  /** Дата поручения. */
  date?: Timestamp;
  /** Тип операции. */
  type?: OperationType;
  /** Описание операции. */
  description?: string;
  /** Статус поручения. */
  state?: OperationState;
  /** Уникальный идентификатор инструмента. */
  instrumentUid?: string;
  /** FIGI. */
  figi?: string;
  /** Тип инструмента (строка). */
  instrumentType?: string;
  /** Тип инструмента (enum). */
  instrumentKind?: InstrumentType;
  /** Уникальный идентификатор позиции. */
  positionUid?: string;
  /** Тикер инструмента. */
  ticker?: string;
  /** Класс-код (секция торгов). */
  classCode?: string;
  /** Сумма операции. */
  payment?: MoneyValue;
  /** Цена операции за 1 инструмент. */
  price?: MoneyValue;
  /** Комиссия. */
  commission?: MoneyValue;
  /** Доходность. */
  yield?: MoneyValue;
  /** Относительная доходность. */
  yieldRelative?: Quotation;
  /** Накопленный купонный доход. */
  accruedInt?: MoneyValue;
  /** Количество единиц инструмента. */
  quantity?: number;
  /** Неисполненный остаток по сделке. */
  quantityRest?: number;
  /** Исполненный остаток. */
  quantityDone?: number;
  /** Дата и время снятия заявки. */
  cancelDateTime?: Timestamp;
  /** Причина отмены операции. */
  cancelReason?: string;
  /** Массив сделок. */
  tradesInfo?: OperationItemTrades;
  /** Идентификатор актива. */
  assetUid?: string;
  /** Массив дочерних операций. */
  childOperations?: ChildOperationItem[];
}

export interface GetOperationsByCursorResponse {
  /** Признак, есть ли следующий элемент. */
  hasNext?: boolean;
  /** Следующий курсор. */
  nextCursor?: string;
  /** Список операций. */
  items?: OperationItem[];
}

// --- Portfolio ---

export interface PortfolioRequest {
  /** Идентификатор счета пользователя. */
  accountId?: string;
  /** Валюта, в которой нужно рассчитать портфель. */
  currency?: CurrencyRequest;
}

export interface PortfolioPosition {
  /** FIGI-идентификатор инструмента. */
  figi?: string;
  /** Тип инструмента. */
  instrumentType?: string;
  /** Количество инструмента в портфеле в штуках. */
  quantity?: Quotation;
  /** Средневзвешенная цена позиции. */
  averagePositionPrice?: MoneyValue;
  /** Текущая рассчитанная доходность позиции. */
  expectedYield?: Quotation;
  /** Текущий НКД. */
  currentNkd?: MoneyValue;
  /** Текущая цена за 1 инструмент. */
  currentPrice?: MoneyValue;
  /** Средняя цена позиции по методу FIFO. */
  averagePositionPriceFifo?: MoneyValue;
  /** Заблокировано на бирже. */
  blocked?: boolean;
  /** Количество бумаг, заблокированных выставленными заявками. */
  blockedLots?: Quotation;
  /** Уникальный идентификатор позиции. */
  positionUid?: string;
  /** Уникальный идентификатор инструмента. */
  instrumentUid?: string;
  /** Вариационная маржа. */
  varMargin?: MoneyValue;
  /** Текущая рассчитанная доходность позиции (FIFO). */
  expectedYieldFifo?: Quotation;
  /** Рассчитанная доходность портфеля за день. */
  dailyYield?: MoneyValue;
  /** Тикер инструмента. */
  ticker?: string;
  /** Класс-код (секция торгов). */
  classCode?: string;
}

export interface VirtualPortfolioPosition {
  positionUid?: string;
  instrumentUid?: string;
  figi?: string;
  instrumentType?: string;
  quantity?: Quotation;
  averagePositionPrice?: MoneyValue;
  expectedYield?: Quotation;
  expectedYieldFifo?: Quotation;
  /** Дата, до которой нужно продать виртуальные бумаги. */
  expireDate?: Timestamp;
  currentPrice?: MoneyValue;
  averagePositionPriceFifo?: MoneyValue;
  dailyYield?: MoneyValue;
  ticker?: string;
  classCode?: string;
}

export interface PortfolioResponse {
  /** Общая стоимость акций в портфеле. */
  totalAmountShares?: MoneyValue;
  /** Общая стоимость облигаций в портфеле. */
  totalAmountBonds?: MoneyValue;
  /** Общая стоимость фондов в портфеле. */
  totalAmountEtf?: MoneyValue;
  /** Общая стоимость валют в портфеле. */
  totalAmountCurrencies?: MoneyValue;
  /** Общая стоимость фьючерсов в портфеле. */
  totalAmountFutures?: MoneyValue;
  /** Текущая относительная доходность портфеля в %. */
  expectedYield?: Quotation;
  /** Список позиций портфеля. */
  positions?: PortfolioPosition[];
  /** Идентификатор счета пользователя. */
  accountId?: string;
  /** Общая стоимость опционов в портфеле. */
  totalAmountOptions?: MoneyValue;
  /** Общая стоимость структурных нот в портфеле. */
  totalAmountSp?: MoneyValue;
  /** Общая стоимость портфеля. */
  totalAmountPortfolio?: MoneyValue;
  /** Массив виртуальных позиций портфеля. */
  virtualPositions?: VirtualPortfolioPosition[];
  /** Рассчитанная доходность портфеля за день в рублях. */
  dailyYield?: MoneyValue;
  /** Относительная доходность в день в %. */
  dailyYieldRelative?: Quotation;
}

// --- Positions ---

export interface PositionsRequest {
  /** Идентификатор счета пользователя. */
  accountId?: string;
}

export interface PositionsSecurities {
  /** FIGI-идентификатор бумаги. */
  figi?: string;
  /** Количество бумаг, заблокированных выставленными заявками. */
  blocked?: number;
  /** Текущий незаблокированный баланс. */
  balance?: number;
  /** Уникальный идентификатор позиции. */
  positionUid?: string;
  /** Уникальный идентификатор инструмента. */
  instrumentUid?: string;
  /** Тикер инструмента. */
  ticker?: string;
  /** Класс-код (секция торгов). */
  classCode?: string;
  /** Заблокировано на бирже. */
  exchangeBlocked?: boolean;
  /** Тип инструмента. */
  instrumentType?: string;
}

export interface PositionsFutures {
  figi?: string;
  blocked?: number;
  balance?: number;
  positionUid?: string;
  instrumentUid?: string;
  ticker?: string;
  classCode?: string;
}

export interface PositionsOptions {
  positionUid?: string;
  instrumentUid?: string;
  ticker?: string;
  classCode?: string;
  blocked?: number;
  balance?: number;
}

export interface PositionsResponse {
  /** Массив валютных позиций портфеля. */
  money?: MoneyValue[];
  /** Массив заблокированных валютных позиций портфеля. */
  blocked?: MoneyValue[];
  /** Список ценно-бумажных позиций портфеля. */
  securities?: PositionsSecurities[];
  /** Признак идущей выгрузки лимитов в данный момент. */
  limitsLoadingInProgress?: boolean;
  /** Список фьючерсов портфеля. */
  futures?: PositionsFutures[];
  /** Список опционов портфеля. */
  options?: PositionsOptions[];
  /** Идентификатор счёта пользователя. */
  accountId?: string;
}

// --- WithdrawLimits ---

export interface WithdrawLimitsRequest {
  accountId?: string;
}

export interface WithdrawLimitsResponse {
  /** Массив валютных позиций портфеля. */
  money?: MoneyValue[];
  /** Массив заблокированных валютных позиций портфеля. */
  blocked?: MoneyValue[];
  /** Заблокировано под гарантийное обеспечение фьючерсов. */
  blockedGuarantee?: MoneyValue[];
}
