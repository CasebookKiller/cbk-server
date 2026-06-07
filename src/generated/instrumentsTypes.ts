import type { MoneyValue, Quotation, Timestamp } from './commonTypes';
import { InstrumentType } from './tbank/operationsTypes';

// 1. BondsBy

/** Тип идентификатора инструмента */
export enum InstrumentIdType {
  /** Значение не определено */
  INSTRUMENT_ID_UNSPECIFIED = 0,
  /** FIGI */
  INSTRUMENT_ID_TYPE_FIGI = 1,
  /** Ticker */
  INSTRUMENT_ID_TYPE_TICKER = 2,
  /** Уникальный идентификатор */
  INSTRUMENT_ID_TYPE_UID = 3,
  /** Идентификатор позиции */
  INSTRUMENT_ID_TYPE_POSITION_UID = 4,
}

/** Запрос получения инструмента по идентификатору */
export interface InstrumentRequest {
  /** Тип идентификатора инструмента */
  idType?: InstrumentIdType;
  /** Идентификатор class_code (обязателен, если id_type = ticker) */
  classCode?: string;
  /** Идентификатор запрашиваемого инструмента */
  id?: string;
}

/** Режим торгов инструмента */
export enum SecurityTradingStatus {
  SECURITY_TRADING_STATUS_UNSPECIFIED = 0,
  SECURITY_TRADING_STATUS_NOT_AVAILABLE_FOR_TRADING = 1,
  SECURITY_TRADING_STATUS_OPENING_PERIOD = 2,
  SECURITY_TRADING_STATUS_CLOSING_PERIOD = 3,
  SECURITY_TRADING_STATUS_BREAK_IN_TRADING = 4,
  SECURITY_TRADING_STATUS_NORMAL_TRADING = 5,
  SECURITY_TRADING_STATUS_CLOSING_AUCTION = 6,
  SECURITY_TRADING_STATUS_DARK_POOL_AUCTION = 7,
  SECURITY_TRADING_STATUS_DISCRETE_AUCTION = 8,
  SECURITY_TRADING_STATUS_OPENING_AUCTION_PERIOD = 9,
  SECURITY_TRADING_STATUS_TRADING_AT_CLOSING_AUCTION_PRICE = 10,
  SECURITY_TRADING_STATUS_SESSION_ASSIGNED = 11,
  SECURITY_TRADING_STATUS_SESSION_CLOSE = 12,
  SECURITY_TRADING_STATUS_SESSION_OPEN = 13,
  SECURITY_TRADING_STATUS_DEALER_NORMAL_TRADING = 14,
  SECURITY_TRADING_STATUS_DEALER_BREAK_IN_TRADING = 15,
  SECURITY_TRADING_STATUS_DEALER_NOT_AVAILABLE_FOR_TRADING = 16,
}

/** Реальная площадка исполнения расчётов */
export enum RealExchange {
  REAL_EXCHANGE_UNSPECIFIED = 0,
  REAL_EXCHANGE_MOEX = 1,
  REAL_EXCHANGE_RTS = 2,
  REAL_EXCHANGE_OTC = 3,
  REAL_EXCHANGE_DEALER = 4,
}

/** Уровень риска облигации */
export enum RiskLevel {
  RISK_LEVEL_UNSPECIFIED = 0,
  RISK_LEVEL_LOW = 1,
  RISK_LEVEL_MODERATE = 2,
  RISK_LEVEL_HIGH = 3,
}

/** Информация о бренде */
export interface BrandData {
  /** Логотип инструмента */
  logoName?: string;
  /** Цвет бренда */
  logoBaseColor?: string;
  /** Цвет текста для цвета логотипа бренда */
  textColor?: string;
}

/** Тип облигации */
export enum BondType {
  BOND_TYPE_UNSPECIFIED = 0,
  /** Замещающая облигация */
  BOND_TYPE_REPLACED = 1,
}

/** Объект передачи информации об облигации */
export interface Bond {
  /** FIGI-идентификатор */
  figi?: string;
  /** Тикер */
  ticker?: string;
  /** Класс-код (секция торгов) */
  classCode?: string;
  /** ISIN */
  isin?: string;
  /** Лотность */
  lot?: number;
  /** Валюта расчётов */
  currency?: string;
  /** Коэффициент ставки риска длинной позиции (deprecated) */
  klong?: Quotation;
  /** Коэффициент ставки риска короткой позиции (deprecated) */
  kshort?: Quotation;
  /** Ставка риска начальной маржи для КСУР лонг */
  dlong?: Quotation;
  /** Ставка риска начальной маржи для КСУР шорт */
  dshort?: Quotation;
  /** Ставка риска начальной маржи для КПУР лонг */
  dlongMin?: Quotation;
  /** Ставка риска начальной маржи для КПУР шорт */
  dshortMin?: Quotation;
  /** Признак доступности для продажи в шорт */
  shortEnabledFlag?: boolean;
  /** Название инструмента */
  name?: string;
  /** Торговая площадка (секция биржи) */
  exchange?: string;
  /** Количество выплат купонов в год */
  couponQuantityPerYear?: number;
  /** Дата погашения облигации по UTC */
  maturityDate?: Timestamp;
  /** Номинал облигации */
  nominal?: MoneyValue;
  /** Первоначальный номинал */
  initialNominal?: MoneyValue;
  /** Дата выпуска */
  stateRegDate?: Timestamp;
  /** Дата размещения */
  placementDate?: Timestamp;
  /** Цена размещения */
  placementPrice?: MoneyValue;
  /** НКД (накопленный купонный доход) на дату */
  aciValue?: MoneyValue;
  /** Страна риска (код) */
  countryOfRisk?: string;
  /** Наименование страны риска */
  countryOfRiskName?: string;
  /** Сектор экономики */
  sector?: string;
  /** Форма выпуска */
  issueKind?: string;
  /** Размер выпуска */
  issueSize?: number;
  /** Плановый размер выпуска */
  issueSizePlan?: number;
  /** Текущий режим торгов */
  tradingStatus?: SecurityTradingStatus;
  /** Признак внебиржевого инструмента (не используется) */
  otcFlag?: boolean;
  /** Признак доступности для покупки */
  buyAvailableFlag?: boolean;
  /** Признак доступности для продажи */
  sellAvailableFlag?: boolean;
  /** Плавающий купон */
  floatingCouponFlag?: boolean;
  /** Бессрочная облигация */
  perpetualFlag?: boolean;
  /** Амортизация долга */
  amortizationFlag?: boolean;
  /** Шаг цены */
  minPriceIncrement?: Quotation;
  /** Возможность торговать через API */
  apiTradeAvailableFlag?: boolean;
  /** Уникальный идентификатор */
  uid?: string;
  /** Реальная площадка исполнения */
  realExchange?: RealExchange;
  /** Уникальный идентификатор позиции */
  positionUid?: string;
  /** Уникальный идентификатор актива */
  assetUid?: string;
  /** Тесты, необходимые для торговли */
  requiredTests?: string[];
  /** Доступность для ИИС */
  forIisFlag?: boolean;
  /** Только для квалифицированных инвесторов */
  forQualInvestorFlag?: boolean;
  /** Торговля по выходным */
  weekendFlag?: boolean;
  /** Флаг заблокированного ТКС */
  blockedTcaFlag?: boolean;
  /** Субординированная облигация */
  subordinatedFlag?: boolean;
  /** Достаточная ликвидность */
  liquidityFlag?: boolean;
  /** Дата первой минутной свечи */
  first1minCandleDate?: Timestamp;
  /** Дата первой дневной свечи */
  first1dayCandleDate?: Timestamp;
  /** Уровень риска */
  riskLevel?: RiskLevel;
  /** Информация о бренде */
  brand?: BrandData;
  /** Тип облигации */
  bondType?: BondType;
  /** Дата погашения (call) */
  callDate?: Timestamp;
  /** Ставка риска в лонг с учётом портфеля клиента */
  dlongClient?: Quotation;
  /** Ставка риска в шорт с учётом портфеля клиента */
  dshortClient?: Quotation;
}

/** Информация об облигации (ответ) */
export interface BondResponse {
  /** Информация об облигации */
  instrument?: Bond;
}

// 2. Bonds

/** Статус запрашиваемых инструментов */
export enum InstrumentStatus {
  /** Значение не определено */
  INSTRUMENT_STATUS_UNSPECIFIED = 0,
  /** Базовый список инструментов (по умолчанию) */
  INSTRUMENT_STATUS_BASE = 1,
  /** Все инструменты */
  INSTRUMENT_STATUS_ALL = 2,
}

/** Площадка торговли */
export enum InstrumentExchangeType {
  /** Площадка не определена */
  INSTRUMENT_EXCHANGE_UNSPECIFIED = 0,
  /** Бумага, торгуемая у дилера */
  INSTRUMENT_EXCHANGE_DEALER = 1,
}

/** Запрос получения списка инструментов */
export interface InstrumentsRequest {
  /** Статус запрашиваемых инструментов */
  instrumentStatus?: InstrumentStatus;
  /** Тип площадки торговли */
  instrumentExchange?: InstrumentExchangeType;
}

/** Список облигаций */
export interface BondsResponse {
  /** Массив облигаций */
  instruments?: Bond[];
}

// 3. CreateFavoriteGroup

/** Запрос создания новой группы избранных инструментов */
export interface CreateFavoriteGroupRequest {
  /** Название группы, не более 255 символов */
  groupName?: string;
  /** Цвет группы в HEX-формате (от "000000" до "FFFFFF") */
  groupColor?: string;
  /** Описание */
  note?: string;
}

/** Ответ создания группы избранных инструментов */
export interface CreateFavoriteGroupResponse {
  /** Уникальный идентификатор группы */
  groupId?: string;
  /** Название группы */
  groupName?: string;
}

// 4. Currencies

/** Объект передачи информации о валюте */
export interface Currency {
  /** FIGI-идентификатор */
  figi?: string;
  /** Тикер */
  ticker?: string;
  /** Класс-код (секция торгов) */
  classCode?: string;
  /** ISIN */
  isin?: string;
  /** Лотность */
  lot?: number;
  /** Валюта расчётов */
  currency?: string;
  /** Коэффициент ставки риска длинной позиции (deprecated) */
  klong?: Quotation;
  /** Коэффициент ставки риска короткой позиции (deprecated) */
  kshort?: Quotation;
  /** Ставка риска начальной маржи для КСУР лонг */
  dlong?: Quotation;
  /** Ставка риска начальной маржи для КСУР шорт */
  dshort?: Quotation;
  /** Ставка риска начальной маржи для КПУР лонг */
  dlongMin?: Quotation;
  /** Ставка риска начальной маржи для КПУР шорт */
  dshortMin?: Quotation;
  /** Признак доступности для операций в шорт */
  shortEnabledFlag?: boolean;
  /** Название инструмента */
  name?: string;
  /** Торговая площадка (секция биржи) */
  exchange?: string;
  /** Номинал */
  nominal?: MoneyValue;
  /** Код страны риска */
  countryOfRisk?: string;
  /** Наименование страны риска */
  countryOfRiskName?: string;
  /** Текущий режим торгов */
  tradingStatus?: SecurityTradingStatus;
  /** Признак внебиржевого инструмента (не используется) */
  otcFlag?: boolean;
  /** Признак доступности для покупки */
  buyAvailableFlag?: boolean;
  /** Признак доступности для продажи */
  sellAvailableFlag?: boolean;
  /** Строковый ISO-код валюты */
  isoCurrencyName?: string;
  /** Шаг цены */
  minPriceIncrement?: Quotation;
  /** Возможность торговать через API */
  apiTradeAvailableFlag?: boolean;
  /** Уникальный идентификатор */
  uid?: string;
  /** Реальная площадка исполнения (биржа) */
  realExchange?: RealExchange;
  /** Уникальный идентификатор позиции */
  positionUid?: string;
  /** Тесты, необходимые для совершения сделок */
  requiredTests?: string[];
  /** Уникальный идентификатор актива */
  assetUid?: string;
  /** Доступность для ИИС */
  forIisFlag?: boolean;
  /** Только для квалифицированных инвесторов */
  forQualInvestorFlag?: boolean;
  /** Торговля по выходным */
  weekendFlag?: boolean;
  /** Флаг заблокированного ТКС */
  blockedTcaFlag?: boolean;
  /** Дата первой минутной свечи */
  first1minCandleDate?: Timestamp;
  /** Дата первой дневной свечи */
  first1dayCandleDate?: Timestamp;
  /** Информация о бренде */
  brand?: BrandData;
  /** Ставка риска в лонг с учётом портфеля клиента */
  dlongClient?: Quotation;
  /** Ставка риска в шорт с учётом портфеля клиента */
  dshortClient?: Quotation;
}

/** Данные по валютам */
export interface CurrenciesResponse {
  /** Массив валют */
  instruments?: Currency[];
}

// 5. CurrencyBy

/** Данные по валюте (ответ на CurrencyBy) */
export interface CurrencyResponse {
  /** Информация о валюте */
  instrument?: Currency;
}

// 6. DeleteFavoriteGroup

/** Запрос удаления избранной группы */
export interface DeleteFavoriteGroupRequest {
  /** Уникальный идентификатор группы */
  groupId?: string;
}

/** Ответ на удаление избранной группы (пустой) */
export interface DeleteFavoriteGroupResponse {}

// 7. EditFavorites

/** Тип действия со списком избранных инструментов */
export enum EditFavoritesActionType {
  EDIT_FAVORITES_ACTION_TYPE_UNSPECIFIED = 0,
  /** Добавить в список */
  EDIT_FAVORITES_ACTION_TYPE_ADD = 1,
  /** Удалить из списка */
  EDIT_FAVORITES_ACTION_TYPE_DEL = 2,
}

/** Инструмент для редактирования списка избранных */
export interface EditFavoritesRequestInstrument {
  /** FIGI-идентификатор (deprecated) */
  figi?: string;
  /** Идентификатор инструмента — figi или instrument_uid */
  instrumentId?: string;
}

/** Запрос редактирования списка избранных инструментов */
export interface EditFavoritesRequest {
  /** Массив инструментов */
  instruments?: EditFavoritesRequestInstrument[];
  /** Тип действия со списком */
  actionType?: EditFavoritesActionType;
  /** Уникальный идентификатор группы (опционально) */
  groupId?: string;
}

/** Избранный инструмент */
export interface FavoriteInstrument {
  /** FIGI */
  figi?: string;
  /** Тикер */
  ticker?: string;
  /** Класс-код */
  classCode?: string;
  /** ISIN */
  isin?: string;
  /** Тип инструмента (строка) */
  instrumentType?: string;
  /** Название */
  name?: string;
  /** Уникальный идентификатор */
  uid?: string;
  /** Признак внебиржевого инструмента (устаревший) */
  otcFlag?: boolean;
  /** Возможность торговать через API */
  apiTradeAvailableFlag?: boolean;
  /** Тип инструмента (enum) */
  instrumentKind?: InstrumentType;   // InstrumentType уже определён ранее
}

/** Результат редактирования списка избранных инструментов */
export interface EditFavoritesResponse {
  /** Массив избранных инструментов */
  favoriteInstruments?: FavoriteInstrument[];
  /** Уникальный идентификатор группы */
  groupId?: string;
}

// 8. EtfBy

/** Объект передачи информации об инвестиционном фонде */
export interface Etf {
  /** FIGI-идентификатор */
  figi?: string;
  /** Тикер */
  ticker?: string;
  /** Класс-код (секция торгов) */
  classCode?: string;
  /** ISIN */
  isin?: string;
  /** Лотность */
  lot?: number;
  /** Валюта расчётов */
  currency?: string;
  /** Коэффициент ставки риска длинной позиции (deprecated) */
  klong?: Quotation;
  /** Коэффициент ставки риска короткой позиции (deprecated) */
  kshort?: Quotation;
  /** Ставка риска начальной маржи для КСУР лонг */
  dlong?: Quotation;
  /** Ставка риска начальной маржи для КСУР шорт */
  dshort?: Quotation;
  /** Ставка риска начальной маржи для КПУР лонг */
  dlongMin?: Quotation;
  /** Ставка риска начальной маржи для КПУР шорт */
  dshortMin?: Quotation;
  /** Признак доступности для операций в шорт */
  shortEnabledFlag?: boolean;
  /** Название инструмента */
  name?: string;
  /** Торговая площадка (секция биржи) */
  exchange?: string;
  /** Размер фиксированной комиссии фонда */
  fixedCommission?: Quotation;
  /** Тип фокуса фонда (equity, fixed_income, mixed_allocation и т.д.) */
  focusType?: string;
  /** Дата выпуска по UTC */
  releasedDate?: Timestamp;
  /** Количество паев фонда в обращении */
  numShares?: Quotation;
  /** Код страны риска */
  countryOfRisk?: string;
  /** Наименование страны риска */
  countryOfRiskName?: string;
  /** Сектор экономики */
  sector?: string;
  /** Частота ребалансировки */
  rebalancingFreq?: string;
  /** Текущий режим торгов */
  tradingStatus?: SecurityTradingStatus;
  /** Признак внебиржевого инструмента (не используется) */
  otcFlag?: boolean;
  /** Признак доступности для покупки */
  buyAvailableFlag?: boolean;
  /** Признак доступности для продажи */
  sellAvailableFlag?: boolean;
  /** Шаг цены */
  minPriceIncrement?: Quotation;
  /** Возможность торговать через API */
  apiTradeAvailableFlag?: boolean;
  /** Уникальный идентификатор */
  uid?: string;
  /** Реальная площадка исполнения (биржа) */
  realExchange?: RealExchange;
  /** Уникальный идентификатор позиции */
  positionUid?: string;
  /** Уникальный идентификатор актива */
  assetUid?: string;
  /** Тип площадки торговли */
  instrumentExchange?: InstrumentExchangeType;
  /** Тесты, необходимые для совершения сделок */
  requiredTests?: string[];
  /** Доступность для ИИС */
  forIisFlag?: boolean;
  /** Только для квалифицированных инвесторов */
  forQualInvestorFlag?: boolean;
  /** Торговля по выходным */
  weekendFlag?: boolean;
  /** Флаг заблокированного ТКС */
  blockedTcaFlag?: boolean;
  /** Достаточная ликвидность */
  liquidityFlag?: boolean;
  /** Дата первой минутной свечи */
  first1minCandleDate?: Timestamp;
  /** Дата первой дневной свечи */
  first1dayCandleDate?: Timestamp;
  /** Информация о бренде */
  brand?: BrandData;
  /** Ставка риска в лонг с учётом портфеля клиента */
  dlongClient?: Quotation;
  /** Ставка риска в шорт с учётом портфеля клиента */
  dshortClient?: Quotation;
}

/** Данные по фонду */
export interface EtfResponse {
  /** Информация о фонде */
  instrument?: Etf;
}

// 9. Etfs

/** Данные по фондам */
export interface EtfsResponse {
  /** Массив фондов */
  instruments?: Etf[];
}

// 10. FindInstrument

/** Запрос на поиск инструментов */
export interface FindInstrumentRequest {
  /** Строка поиска */
  query?: string;
  /** Фильтр по типу инструмента */
  instrumentKind?: InstrumentType;
  /** Фильтр для отображения только торговых инструментов */
  apiTradeAvailableFlag?: boolean;
}

/** Краткая информация об инструменте */
export interface InstrumentShort {
  /** ISIN */
  isin?: string;
  /** FIGI */
  figi?: string;
  /** Тикер */
  ticker?: string;
  /** Класс-код (секция торгов) */
  classCode?: string;
  /** Тип инструмента (строка) */
  instrumentType?: string;
  /** Название */
  name?: string;
  /** Уникальный идентификатор */
  uid?: string;
  /** Уникальный идентификатор позиции */
  positionUid?: string;
  /** Тип инструмента (enum) */
  instrumentKind?: InstrumentType;
  /** Возможность торговать через API */
  apiTradeAvailableFlag?: boolean;
  /** Доступность для ИИС */
  forIisFlag?: boolean;
  /** Дата первой минутной свечи */
  first1minCandleDate?: Timestamp;
  /** Дата первой дневной свечи */
  first1dayCandleDate?: Timestamp;
  /** Только для квалифицированных инвесторов */
  forQualInvestorFlag?: boolean;
  /** Торговля по выходным */
  weekendFlag?: boolean;
  /** Флаг заблокированного ТКС */
  blockedTcaFlag?: boolean;
  /** Количество бумаг в лоте */
  lot?: number;
}

/** Результат поиска инструментов */
export interface FindInstrumentResponse {
  /** Массив инструментов, удовлетворяющих условиям поиска */
  instruments?: InstrumentShort[];
}

// 11. FutureBy

/** Объект передачи информации о фьючерсе */
export interface Future {
  /** FIGI-идентификатор */
  figi?: string;
  /** Тикер */
  ticker?: string;
  /** Класс-код (секция торгов) */
  classCode?: string;
  /** Лотность */
  lot?: number;
  /** Валюта расчетов */
  currency?: string;
  /** Коэффициент ставки риска длинной позиции (deprecated) */
  klong?: Quotation;
  /** Коэффициент ставки риска короткой позиции (deprecated) */
  kshort?: Quotation;
  /** Ставка риска начальной маржи для КСУР лонг */
  dlong?: Quotation;
  /** Ставка риска начальной маржи для КСУР шорт */
  dshort?: Quotation;
  /** Ставка риска начальной маржи для КПУР лонг */
  dlongMin?: Quotation;
  /** Ставка риска начальной маржи для КПУР шорт */
  dshortMin?: Quotation;
  /** Признак доступности для операций шорт */
  shortEnabledFlag?: boolean;
  /** Название инструмента */
  name?: string;
  /** Торговая площадка (секция биржи) */
  exchange?: string;
  /** Дата начала обращения контракта по UTC */
  firstTradeDate?: Timestamp;
  /** Дата, до которой возможно проведение операций с фьючерсом, по UTC */
  lastTradeDate?: Timestamp;
  /** Тип фьючерса (physical_delivery или cash_settlement) */
  futuresType?: string;
  /** Тип актива (commodity, currency, security, index) */
  assetType?: string;
  /** Основной актив */
  basicAsset?: string;
  /** Размер основного актива */
  basicAssetSize?: Quotation;
  /** Код страны риска */
  countryOfRisk?: string;
  /** Наименование страны риска */
  countryOfRiskName?: string;
  /** Сектор экономики */
  sector?: string;
  /** Дата истечения срока в UTC */
  expirationDate?: Timestamp;
  /** Текущий режим торгов */
  tradingStatus?: SecurityTradingStatus;
  /** Признак внебиржевого инструмента (не используется) */
  otcFlag?: boolean;
  /** Признак доступности для покупки */
  buyAvailableFlag?: boolean;
  /** Признак доступности для продажи */
  sellAvailableFlag?: boolean;
  /** Шаг цены */
  minPriceIncrement?: Quotation;
  /** Возможность торговать через API */
  apiTradeAvailableFlag?: boolean;
  /** Уникальный идентификатор */
  uid?: string;
  /** Реальная площадка исполнения (биржа) */
  realExchange?: RealExchange;
  /** Уникальный идентификатор позиции */
  positionUid?: string;
  /** Уникальный идентификатор позиции основного инструмента */
  basicAssetPositionUid?: string;
  /** Тесты, необходимые для совершения сделок */
  requiredTests?: string[];
  /** Доступность для ИИС */
  forIisFlag?: boolean;
  /** Только для квалифицированных инвесторов */
  forQualInvestorFlag?: boolean;
  /** Торговля по выходным */
  weekendFlag?: boolean;
  /** Флаг заблокированного ТКС */
  blockedTcaFlag?: boolean;
  /** Дата первой минутной свечи */
  first1minCandleDate?: Timestamp;
  /** Дата первой дневной свечи */
  first1dayCandleDate?: Timestamp;
  /** Гарантийное обеспечение при покупке */
  initialMarginOnBuy?: MoneyValue;
  /** Гарантийное обеспечение при продаже */
  initialMarginOnSell?: MoneyValue;
  /** Стоимость шага цены */
  minPriceIncrementAmount?: Quotation;
  /** Информация о бренде */
  brand?: BrandData;
  /** Ставка риска в лонг с учётом портфеля клиента */
  dlongClient?: Quotation;
  /** Ставка риска в шорт с учётом портфеля клиента */
  dshortClient?: Quotation;
}

/** Данные по фьючерсу */
export interface FutureResponse {
  /** Информация о фьючерсе */
  instrument?: Future;
}

// 12. Futures

/** Данные по фьючерсам */
export interface FuturesResponse {
  /** Массив фьючерсов */
  instruments?: Future[];
}

// 13. GetAccruedInterests

/** Запрос НКД по облигации */
export interface GetAccruedInterestsRequest {
  /** FIGI-идентификатор инструмента (deprecated) */
  figi?: string;
  /** Начало запрашиваемого периода по UTC */
  from?: Timestamp;
  /** Окончание запрашиваемого периода по UTC */
  to?: Timestamp;
  /** Идентификатор инструмента — figi или instrument_uid */
  instrumentId?: string;
}

/** Операция начисления купонов */
export interface AccruedInterest {
  /** Дата и время выплаты по UTC */
  date?: Timestamp;
  /** Величина выплаты */
  value?: Quotation;
  /** Величина выплаты в процентах от номинала */
  valuePercent?: Quotation;
  /** Номинал облигации */
  nominal?: Quotation;
}

/** НКД облигации */
export interface GetAccruedInterestsResponse {
  /** Массив операций начисления купонов */
  accruedInterests?: AccruedInterest[];
}

// 14. GetAssetBy

// ---------------- Перечисления ----------------

/** Тип актива */
export enum AssetType {
  ASSET_TYPE_UNSPECIFIED = 0,
  ASSET_TYPE_CURRENCY = 1,
  ASSET_TYPE_COMMODITY = 2,
  ASSET_TYPE_INDEX = 3,
  ASSET_TYPE_SECURITY = 4,
}

/** Тип акций */
export enum ShareType {
  SHARE_TYPE_UNSPECIFIED = 0,
  SHARE_TYPE_COMMON = 1,
  SHARE_TYPE_PREFERRED = 2,
  SHARE_TYPE_ADR = 3,
  SHARE_TYPE_GDR = 4,
  SHARE_TYPE_MLP = 5,
  SHARE_TYPE_NY_REG_SHRS = 6,
  SHARE_TYPE_CLOSED_END_FUND = 7,
  SHARE_TYPE_REIT = 8,
}

/** Тип структурной ноты */
export enum StructuredProductType {
  SP_TYPE_UNSPECIFIED = 0,
  SP_TYPE_DELIVERABLE = 1,
  SP_TYPE_NON_DELIVERABLE = 2,
}

// ---------------- Вложенные типы актива ----------------

/** Валюта (в составе AssetFull) */
export interface AssetCurrency {
  /** ISO-код валюты */
  baseCurrency?: string;
}

/** Акция (в составе AssetSecurity) */
export interface AssetShare {
  /** Тип акции */
  type?: ShareType;
  /** Объем выпуска (шт.) */
  issueSize?: Quotation;
  /** Номинал */
  nominal?: Quotation;
  /** Валюта номинала */
  nominalCurrency?: string;
  /** Индекс (Bloomberg) */
  primaryIndex?: string;
  /** Ставка дивиденда (для привилегированных акций) */
  dividendRate?: Quotation;
  /** Тип привилегированных акций */
  preferredShareType?: string;
  /** Дата IPO */
  ipoDate?: Timestamp;
  /** Дата регистрации */
  registryDate?: Timestamp;
  /** Признак наличия дивидендной доходности */
  divYieldFlag?: boolean;
  /** Форма выпуска ФИ */
  issueKind?: string;
  /** Дата размещения акции */
  placementDate?: Timestamp;
  /** ISIN базового актива */
  represIsin?: string;
  /** Объявленное количество, шт. */
  issueSizePlan?: Quotation;
  /** Количество акций в свободном обращении */
  totalFloat?: Quotation;
}

/** Облигация (в составе AssetSecurity) */
export interface AssetBond {
  /** Текущий номинал */
  currentNominal?: Quotation;
  /** Наименование заемщика */
  borrowName?: string;
  /** Объем эмиссии облигации (стоимость) */
  issueSize?: Quotation;
  /** Номинал облигации */
  nominal?: Quotation;
  /** Валюта номинала */
  nominalCurrency?: string;
  /** Форма выпуска облигации */
  issueKind?: string;
  /** Форма дохода облигации */
  interestKind?: string;
  /** Количество выплат в год */
  couponQuantityPerYear?: number;
  /** Признак индексируемого номинала */
  indexedNominalFlag?: boolean;
  /** Признак субординированной облигации */
  subordinatedFlag?: boolean;
  /** Признак обеспеченной облигации */
  collateralFlag?: boolean;
  /** Купоны не облагаются налогом */
  taxFreeFlag?: boolean;
  /** Признак амортизации */
  amortizationFlag?: boolean;
  /** Плавающий купон */
  floatingCouponFlag?: boolean;
  /** Бессрочная облигация */
  perpetualFlag?: boolean;
  /** Дата погашения */
  maturityDate?: Timestamp;
  /** Описание условий доп. дохода */
  returnCondition?: string;
  /** Дата выпуска */
  stateRegDate?: Timestamp;
  /** Дата размещения */
  placementDate?: Timestamp;
  /** Цена размещения */
  placementPrice?: Quotation;
  /** Объявленное количество, шт. */
  issueSizePlan?: Quotation;
}

/** Структурная нота (в составе AssetSecurity) */
export interface AssetStructuredProduct {
  /** Наименование заемщика */
  borrowName?: string;
  /** Номинал */
  nominal?: Quotation;
  /** Валюта номинала */
  nominalCurrency?: string;
  /** Тип структурной ноты */
  type?: StructuredProductType;
  /** Стратегия портфеля */
  logicPortfolio?: string;
  /** Тип базового актива */
  assetType?: AssetType;
  /** Вид базового актива */
  basicAsset?: string;
  /** Барьер сохранности в процентах */
  safetyBarrier?: Quotation;
  /** Дата погашения */
  maturityDate?: Timestamp;
  /** Объявленное количество, шт. */
  issueSizePlan?: Quotation;
  /** Объем размещения */
  issueSize?: Quotation;
  /** Дата размещения */
  placementDate?: Timestamp;
  /** Форма выпуска */
  issueKind?: string;
}

/** Фонд (в составе AssetSecurity) */
export interface AssetEtf {
  /** Суммарные расходы фонда в % */
  totalExpense?: Quotation;
  /** Барьерная ставка доходности */
  hurdleRate?: Quotation;
  /** Комиссия за успешные результаты */
  performanceFee?: Quotation;
  /** Фиксированная комиссия за управление */
  fixedCommission?: Quotation;
  /** Тип распределения доходов */
  paymentType?: string;
  /** Признак water mark */
  watermarkFlag?: boolean;
  /** Премия при покупке доли в % */
  buyPremium?: Quotation;
  /** Скидка при продаже доли в % */
  sellDiscount?: Quotation;
  /** Признак ребалансировки */
  rebalancingFlag?: boolean;
  /** Периодичность ребалансировки */
  rebalancingFreq?: string;
  /** Тип управления */
  managementType?: string;
  /** Индекс, который реплицирует фонд */
  primaryIndex?: string;
  /** База ETF */
  focusType?: string;
  /** Использование заемных активов */
  leveragedFlag?: boolean;
  /** Количество акций в обращении */
  numShare?: Quotation;
  /** Обязательство по отчетности UCITS */
  ucitsFlag?: boolean;
  /** Дата выпуска */
  releasedDate?: Timestamp;
  /** Описание фонда */
  description?: string;
  /** Описание индекса */
  primaryIndexDescription?: string;
  /** Основные компании */
  primaryIndexCompany?: string;
  /** Срок восстановления индекса */
  indexRecoveryPeriod?: Quotation;
  /** IVAV-код */
  inavCode?: string;
  /** Признак дивидендной доходности */
  divYieldFlag?: boolean;
  /** Комиссия на покрытие расходов */
  expenseCommission?: Quotation;
  /** Ошибка следования за индексом */
  primaryIndexTrackingError?: Quotation;
  /** Плановая ребалансировка */
  rebalancingPlan?: string;
  /** Налоговые ставки */
  taxRate?: string;
  /** Даты ребалансировок */
  rebalancingDates?: Timestamp[];
  /** Форма выпуска */
  issueKind?: string;
  /** Номинал */
  nominal?: Quotation;
  /** Валюта номинала */
  nominalCurrency?: string;
}

/** Клиринговый сертификат участия (в составе AssetSecurity) */
export interface AssetClearingCertificate {
  /** Номинал */
  nominal?: Quotation;
  /** Валюта номинала */
  nominalCurrency?: string;
}

/** Ценная бумага (в составе AssetFull) */
export interface AssetSecurity {
  /** ISIN */
  isin?: string;
  /** Тип ценной бумаги */
  type?: string;
  /** Тип инструмента */
  instrumentKind?: InstrumentType;
  /** Акция */
  share?: AssetShare;
  /** Облигация */
  bond?: AssetBond;
  /** Структурная нота */
  sp?: AssetStructuredProduct;
  /** Фонд */
  etf?: AssetEtf;
  /** Клиринговый сертификат */
  clearingCertificate?: AssetClearingCertificate;
}

/** Бренд актива */
export interface AssetBrand {
  /** UID бренда */
  uid?: string;
  /** Наименование */
  name?: string;
  /** Описание */
  description?: string;
  /** Информация */
  info?: string;
  /** Компания */
  company?: string;
  /** Сектор */
  sector?: string;
  /** Код страны риска */
  countryOfRisk?: string;
  /** Наименование страны риска */
  countryOfRiskName?: string;
}

/** Связь с другим инструментом */
export interface InstrumentLink {
  /** Тип связи */
  type?: string;
  /** UID связанного инструмента */
  instrumentUid?: string;
}

/** Идентификаторы инструмента */
export interface AssetInstrument {
  /** Уникальный идентификатор инструмента */
  uid?: string;
  /** FIGI */
  figi?: string;
  /** Тип инструмента (строка) */
  instrumentType?: string;
  /** Тикер */
  ticker?: string;
  /** Класс-код */
  classCode?: string;
  /** Массив связанных инструментов */
  links?: InstrumentLink[];
  /** Тип инструмента (enum) */
  instrumentKind?: InstrumentType;
  /** ID позиции */
  positionUid?: string;
}

/** Полные данные актива */
export interface AssetFull {
  /** Уникальный идентификатор актива */
  uid?: string;
  /** Тип актива */
  type?: AssetType;
  /** Наименование */
  name?: string;
  /** Короткое наименование */
  nameBrief?: string;
  /** Описание */
  description?: string;
  /** Дата и время удаления */
  deletedAt?: Timestamp;
  /** Тестирование клиентов */
  requiredTests?: string[];
  /** Валюта (если тип валюты) */
  currency?: AssetCurrency;
  /** Ценная бумага (если тип ценной бумаги) */
  security?: AssetSecurity;
  /** Номер государственной регистрации */
  gosRegCode?: string;
  /** Код CFI */
  cfi?: string;
  /** Код НРД */
  codeNsd?: string;
  /** Статус */
  status?: string;
  /** Бренд */
  brand?: AssetBrand;
  /** Дата и время последнего обновления */
  updatedAt?: Timestamp;
  /** Код типа ц.б. по Банку России */
  brCode?: string;
  /** Наименование кода типа ц.б. */
  brCodeName?: string;
  /** Массив идентификаторов инструментов */
  instruments?: AssetInstrument[];
}

/** Запрос актива по идентификатору */
export interface AssetRequest {
  /** UID-идентификатор актива */
  id?: string;
}

/** Ответ с активом */
export interface AssetResponse {
  /** Актив */
  asset?: AssetFull;
}

// 15. GetAssetFundamentals

/** Фундаментальные показатели по активу */
export interface StatisticResponse {
  /** Идентификатор актива */
  assetUid?: string;
  /** Валюта */
  currency?: string;
  /** Рыночная капитализация */
  marketCapitalization?: number;
  /** Максимум за год */
  highPriceLast52Weeks?: number;
  /** Минимум за год */
  lowPriceLast52Weeks?: number;
  /** Средний объем торгов за 10 дней */
  averageDailyVolumeLast10Days?: number;
  /** Средний объем торгов за месяц */
  averageDailyVolumeLast4Weeks?: number;
  /** Бета */
  beta?: number;
  /** Доля акций в свободном обращении */
  freeFloat?: number;
  /** Процент форвардной дивидендной доходности */
  forwardAnnualDividendYield?: number;
  /** Количество акций в обращении */
  sharesOutstanding?: number;
  /** Выручка */
  revenueTtm?: number;
  /** EBITDA */
  ebitdaTtm?: number;
  /** Чистая прибыль */
  netIncomeTtm?: number;
  /** EPS */
  epsTtm?: number;
  /** Разводненная EPS */
  dilutedEpsTtm?: number;
  /** Свободный денежный поток */
  freeCashFlowTtm?: number;
  /** Среднегодовой рост выручки за 5 лет */
  fiveYearAnnualRevenueGrowthRate?: number;
  /** Среднегодовой рост выручки за 3 года */
  threeYearAnnualRevenueGrowthRate?: number;
  /** P/E */
  peRatioTtm?: number;
  /** P/S */
  priceToSalesTtm?: number;
  /** P/B */
  priceToBookTtm?: number;
  /** P/FCF */
  priceToFreeCashFlowTtm?: number;
  /** Рыночная стоимость компании */
  totalEnterpriseValueMrq?: number;
  /** EV/EBITDA */
  evToEbitdaMrq?: number;
  /** Маржа чистой прибыли */
  netMarginMrq?: number;
  /** Рентабельность чистой прибыли */
  netInterestMarginMrq?: number;
  /** ROE */
  roe?: number;
  /** ROA */
  roa?: number;
  /** ROIC */
  roic?: number;
  /** Сумма обязательств */
  totalDebtMrq?: number;
  /** Долг/Собственный капитал */
  totalDebtToEquityMrq?: number;
  /** Total Debt/EBITDA */
  totalDebtToEbitdaMrq?: number;
  /** FCF/Price */
  freeCashFlowToPrice?: number;
  /** Чистый долг/EBITDA */
  netDebtToEbitda?: number;
  /** Коэффициент текущей ликвидности */
  currentRatioMrq?: number;
  /** FCCR */
  fixedChargeCoverageRatioFy?: number;
  /** Дивидендная доходность за 12 месяцев */
  dividendYieldDailyTtm?: number;
  /** Выплаченные дивиденды за 12 месяцев */
  dividendRateTtm?: number;
  /** Дивиденды на акцию */
  dividendsPerShare?: number;
  /** Средняя дивидендная доходность за 5 лет */
  fiveYearsAverageDividendYield?: number;
  /** Среднегодовой рост дивидендов за 5 лет */
  fiveYearAnnualDividendGrowthRate?: number;
  /** Процент чистой прибыли на дивиденды */
  dividendPayoutRatioFy?: number;
  /** Обратный выкуп акций */
  buyBackTtm?: number;
  /** Рост выручки за 1 год */
  oneYearAnnualRevenueGrowthRate?: number;
  /** Код страны */
  domicileIndicatorCode?: string;
  /** Соотношение депозитарной расписки к акциям */
  adrToCommonShareRatio?: number;
  /** Количество сотрудников */
  numberOfEmployees?: number;
  /** Дата закрытия реестра под дивиденды */
  exDividendDate?: Timestamp;
  /** Начало фискального периода */
  fiscalPeriodStartDate?: Timestamp;
  /** Окончание фискального периода */
  fiscalPeriodEndDate?: Timestamp;
  /** Изменение общего дохода за 5 лет */
  revenueChangeFiveYears?: number;
  /** Изменение EPS за 5 лет */
  epsChangeFiveYears?: number;
  /** Изменение EBITDA за 5 лет */
  ebitdaChangeFiveYears?: number;
  /** Изменение общей задолженности за 5 лет */
  totalDebtChangeFiveYears?: number;
  /** Отношение EV к выручке */
  evToSales?: number;
}

/** Запрос фундаментальных показателей */
export interface GetAssetFundamentalsRequest {
  /** Массив идентификаторов активов, не более 100 шт. */
  assets?: string[];
}

/** Ответ с фундаментальными показателями */
export interface GetAssetFundamentalsResponse {
  /** Массив фундаментальных показателей */
  fundamentals?: StatisticResponse[];
}

// 16. GetAssetReports

/** Тип периода отчета */
export enum AssetReportPeriodType {
  /** Не указан */
  PERIOD_TYPE_UNSPECIFIED = 0,
  /** Квартальный */
  PERIOD_TYPE_QUARTER = 1,
  /** Полугодовой */
  PERIOD_TYPE_SEMIANNUAL = 2,
  /** Годовой */
  PERIOD_TYPE_ANNUAL = 3,
}

/** Событие отчета эмитента */
export interface GetAssetReportsEvent {
  /** Идентификатор инструмента */
  instrumentId?: string;
  /** Дата публикации отчета */
  reportDate?: Timestamp;
  /** Год периода отчета */
  periodYear?: number;
  /** Номер периода */
  periodNum?: number;
  /** Тип отчета */
  periodType?: AssetReportPeriodType;
  /** Дата создания записи */
  createdAt?: Timestamp;
}

/** Запрос отчетов эмитентов */
export interface GetAssetReportsRequest {
  /** Идентификатор инструмента в формате UID */
  instrumentId?: string;
  /** Начало запрашиваемого периода по UTC */
  from?: Timestamp;
  /** Окончание запрашиваемого периода по UTC */
  to?: Timestamp;
}

/** Ответ с отчетами эмитентов */
export interface GetAssetReportsResponse {
  /** Массив событий отчетов */
  events?: GetAssetReportsEvent[];
}

// 17. GetAssets

/** Запрос списка активов */
export interface AssetsRequest {
  /** Тип инструмента (опционально) */
  instrumentType?: InstrumentType;
  /** Статус запрашиваемых инструментов (опционально) */
  instrumentStatus?: InstrumentStatus;
}

/** Информация об активе (сокращённая, для списка) */
export interface Asset {
  /** Уникальный идентификатор актива */
  uid?: string;
  /** Тип актива */
  type?: AssetType;                // AssetType уже определён
  /** Наименование актива */
  name?: string;
  /** Массив идентификаторов инструментов */
  instruments?: AssetInstrument[]; // AssetInstrument уже определён
}

/** Список активов */
export interface AssetsResponse {
  /** Активы */
  assets?: Asset[];
}

// 18. GetBondCoupons

/** Тип купона */
export enum CouponType {
  /** Неопределенное значение */
  COUPON_TYPE_UNSPECIFIED = 0,
  /** Постоянный */
  COUPON_TYPE_CONSTANT = 1,
  /** Плавающий */
  COUPON_TYPE_FLOATING = 2,
  /** Дисконт */
  COUPON_TYPE_DISCOUNT = 3,
  /** Ипотечный */
  COUPON_TYPE_MORTGAGE = 4,
  /** Фиксированный */
  COUPON_TYPE_FIX = 5,
  /** Переменный */
  COUPON_TYPE_VARIABLE = 6,
  /** Прочее */
  COUPON_TYPE_OTHER = 7,
}

/** Объект передачи информации о купоне облигации */
export interface Coupon {
  /** FIGI-идентификатор инструмента */
  figi?: string;
  /** Дата выплаты купона */
  couponDate?: Timestamp;
  /** Номер купона */
  couponNumber?: number;
  /** Дата фиксации реестра (опционально) */
  fixDate?: Timestamp;
  /** Выплата на одну облигацию */
  payOneBond?: MoneyValue;
  /** Тип купона */
  couponType?: CouponType;
  /** Начало купонного периода */
  couponStartDate?: Timestamp;
  /** Окончание купонного периода */
  couponEndDate?: Timestamp;
  /** Купонный период в днях */
  couponPeriod?: number;
}

/** Запрос купонов по облигации */
export interface GetBondCouponsRequest {
  /** FIGI-идентификатор (deprecated) */
  figi?: string;
  /** Начало запрашиваемого периода (UTC) */
  from?: Timestamp;
  /** Окончание запрашиваемого периода (UTC) */
  to?: Timestamp;
  /** Идентификатор инструмента (figi или instrument_uid) */
  instrumentId?: string;
}

/** Купоны по облигации */
export interface GetBondCouponsResponse {
  /** Массив купонов */
  events?: Coupon[];
}

// 19. GetBondEvents

/** Тип события по облигации */
export enum EventType {
  /** Неопределенное значение */
  EVENT_TYPE_UNSPECIFIED = 0,
  /** Купон */
  EVENT_TYPE_CPN = 1,
  /** Опцион (оферта) */
  EVENT_TYPE_CALL = 2,
  /** Погашение */
  EVENT_TYPE_MTY = 3,
  /** Конвертация */
  EVENT_TYPE_CONV = 4,
}

/** Информация о событии по облигации */
export interface BondEvent {
  /** Идентификатор инструмента */
  instrumentId?: string;
  /** Номер события для данного типа */
  eventNumber?: number;
  /** Дата события */
  eventDate?: Timestamp;
  /** Тип события */
  eventType?: EventType;
  /** Полное количество бумаг, задействованных в событии */
  eventTotalVol?: Quotation;
  /** Дата фиксации владельцев для участия в событии */
  fixDate?: Timestamp;
  /** Дата определения даты или факта события */
  rateDate?: Timestamp;
  /** Дата дефолта (если применимо) */
  defaultDate?: Timestamp;
  /** Дата реального исполнения обязательства */
  realPayDate?: Timestamp;
  /** Дата выплаты */
  payDate?: Timestamp;
  /** Выплата на одну облигацию */
  payOneBond?: MoneyValue;
  /** Выплаты на все бумаги, задействованные в событии */
  moneyFlowVal?: MoneyValue;
  /** Признак исполнения */
  execution?: string;
  /** Тип операции */
  operationType?: string;
  /** Стоимость операции — ставка купона, доля номинала, цена выкупа или коэффициент конвертации */
  value?: Quotation;
  /** Примечание */
  note?: string;
  /** ID выпуска бумаг, в который произведена конвертация (для конвертаций) */
  convertToFinToolId?: string;
  /** Начало купонного периода */
  couponStartDate?: Timestamp;
  /** Окончание купонного периода */
  couponEndDate?: Timestamp;
  /** Купонный период */
  couponPeriod?: number;
  /** Ставка купона, процентов годовых */
  couponInterestRate?: Quotation;
}

/** Запрос событий по облигации */
export interface GetBondEventsRequest {
  /** Начало запрашиваемого периода по UTC */
  from?: Timestamp;
  /** Окончание запрашиваемого периода по UTC */
  to?: Timestamp;
  /** Идентификатор инструмента — figi или instrument_uid */
  instrumentId?: string;
  /** Тип события */
  type?: EventType;
}

/** Ответ со списком событий по облигации */
export interface GetBondEventsResponse {
  /** Массив событий */
  events?: BondEvent[];
}

// 20. GetBrandBy

/** Запрос бренда по идентификатору */
export interface GetBrandRequest {
  /** UID-идентификатор бренда */
  id?: string;
}

/** Бренд */
export interface Brand {
  /** UID-идентификатор бренда */
  uid?: string;
  /** Наименование бренда */
  name?: string;
  /** Описание */
  description?: string;
  /** Информация о бренде */
  info?: string;
  /** Компания */
  company?: string;
  /** Сектор */
  sector?: string;
  /** Код страны риска */
  countryOfRisk?: string;
  /** Наименование страны риска */
  countryOfRiskName?: string;
}

// 21. GetBrands

/** Параметры страницы (пагинация) */
export interface Page {
  /** Максимальное число возвращаемых записей */
  limit?: number;
  /** Порядковый номер страницы, начиная с 0 */
  pageNumber?: number;
}

/** Ответ с информацией о пагинации */
export interface PageResponse {
  /** Максимальное число возвращаемых записей */
  limit?: number;
  /** Порядковый номер страницы, начиная с 0 */
  pageNumber?: number;
  /** Общее количество записей */
  totalCount?: number;
}

/** Запрос списка брендов */
export interface GetBrandsRequest {
  /** Настройки пагинации */
  paging?: Page;
}

/** Список брендов */
export interface GetBrandsResponse {
  /** Массив брендов */
  brands?: Brand[];
  /** Данные по пагинации */
  paging?: PageResponse;
}

// 22. GetConsensusForecasts

/** Рекомендация аналитиков */
export enum Recommendation {
  /** Не определено */
  RECOMMENDATION_UNSPECIFIED = 0,
  /** Покупать */
  RECOMMENDATION_BUY = 1,
  /** Держать */
  RECOMMENDATION_HOLD = 2,
  /** Продавать */
  RECOMMENDATION_SELL = 3,
}

/** Прогноз аналитиков */
export interface ConsensusForecastsItem {
  /** UID-идентификатор */
  uid?: string;
  /** UID-идентификатор актива */
  assetUid?: string;
  /** Дата и время создания записи */
  createdAt?: Timestamp;
  /** Целевая цена на 12 месяцев */
  bestTargetPrice?: Quotation;
  /** Минимальная прогнозная цена */
  bestTargetLow?: Quotation;
  /** Максимальная прогнозная цена */
  bestTargetHigh?: Quotation;
  /** Количество аналитиков рекомендующих покупать */
  totalBuyRecommend?: number;
  /** Количество аналитиков рекомендующих держать */
  totalHoldRecommend?: number;
  /** Количество аналитиков рекомендующих продавать */
  totalSellRecommend?: number;
  /** Валюта прогнозов */
  currency?: string;
  /** Консенсус-прогноз */
  consensus?: Recommendation;
  /** Дата прогноза */
  prognosisDate?: Timestamp;
}

/** Запрос консенсус-прогнозов */
export interface GetConsensusForecastsRequest {
  /** Настройки пагинации */
  paging?: Page;
}

/** Ответ с консенсус-прогнозами */
export interface GetConsensusForecastsResponse {
  /** Массив прогнозов */
  items?: ConsensusForecastsItem[];
  /** Данные по пагинации */
  page?: PageResponse;
}

// 23. GetContries

/** Данные о стране */
export interface CountryResponse {
  /** Двухбуквенный код страны */
  alfaTwo?: string;
  /** Трехбуквенный код страны */
  alfaThree?: string;
  /** Наименование страны */
  name?: string;
  /** Краткое наименование страны */
  nameBrief?: string;
}

/** Запрос справочника стран (пустой) */
export interface GetCountriesRequest {}

/** Справочник стран */
export interface GetCountriesResponse {
  /** Массив стран */
  countries?: CountryResponse[];
}

// 24. GetDividends

/** Запрос дивидендов */
export interface GetDividendsRequest {
  /** FIGI-идентификатор (deprecated) */
  figi?: string;
  /** Начало запрашиваемого периода по UTC (фильтр по record_date) */
  from?: Timestamp;
  /** Окончание запрашиваемого периода по UTC (фильтр по record_date) */
  to?: Timestamp;
  /** Идентификатор инструмента — figi или instrument_uid */
  instrumentId?: string;
}

/** Информация о выплате дивидендов */
export interface Dividend {
  /** Величина дивиденда на 1 ценную бумагу (включая валюту) */
  dividendNet?: MoneyValue;
  /** Дата фактических выплат по UTC */
  paymentDate?: Timestamp;
  /** Дата объявления дивидендов по UTC */
  declaredDate?: Timestamp;
  /** Последний день покупки для получения выплаты по UTC */
  lastBuyDate?: Timestamp;
  /** Тип выплаты (Regular Cash, Cancelled, Daily Accrual, Return of Capital и пр.) */
  dividendType?: string;
  /** Дата фиксации реестра по UTC */
  recordDate?: Timestamp;
  /** Регулярность выплаты (Annual, Semi-Anl и пр.) */
  regularity?: string;
  /** Цена закрытия инструмента на момент ex_dividend_date */
  closePrice?: MoneyValue;
  /** Величина доходности */
  yieldValue?: Quotation;
  /** Дата и время создания записи по UTC */
  createdAt?: Timestamp;
}

/** Список дивидендов */
export interface GetDividendsResponse {
  /** Массив дивидендов */
  dividends?: Dividend[];
}

// 25. GetFavoriteGroups

/** Запрос получения списка избранных групп */
export interface GetFavoriteGroupsRequest {
  /** Массив идентификаторов инструментов (`figi` или `instrument_uid`).
   * Если в группе будет хотя бы один из инструментов массива, то в ответе у группы вернется признак `containsInstrument = true`. */
  instrumentId?: string[];
  /** Массив идентификаторов групп, которые необходимо исключить из ответа */
  excludedGroupId?: string[];
}

/** Избранная группа */
export interface FavoriteGroup {
  /** Уникальный идентификатор группы */
  groupId?: string;
  /** Название группы */
  groupName?: string;
  /** Цвет группы в HEX-формате */
  color?: string;
  /** Количество инструментов в группе */
  size?: number;
  /** Признак наличия в группе хотя бы одного инструмента из запроса */
  containsInstrument?: boolean;
}

/** Ответ со списком избранных групп */
export interface GetFavoriteGroupsResponse {
  /** Массив групп избранных списков инструментов */
  groups?: FavoriteGroup[];
}

// 26. GetFavorites

/** Запрос списка избранных инструментов */
export interface GetFavoritesRequest {
  /** Уникальный идентификатор группы (опционально) */
  groupId?: string;
}

/** Список избранных инструментов */
export interface GetFavoritesResponse {
  /** Массив избранных инструментов */
  favoriteInstruments?: FavoriteInstrument[];
  /** Уникальный идентификатор группы */
  groupId?: string;
}

// 27. GetForecastBy

/** Запрос прогнозов инвестдомов */
export interface GetForecastRequest {
  /** Идентификатор инструмента */
  instrumentId?: string;
}

/** Прогноз отдельного инвестдома */
export interface TargetItem {
  /** Уникальный идентификатор инструмента */
  uid?: string;
  /** Тикер инструмента */
  ticker?: string;
  /** Название компании */
  company?: string;
  /** Прогноз */
  recommendation?: Recommendation;
  /** Дата прогноза */
  recommendationDate?: Timestamp;
  /** Валюта */
  currency?: string;
  /** Текущая цена */
  currentPrice?: Quotation;
  /** Прогнозируемая цена */
  targetPrice?: Quotation;
  /** Изменение цены */
  priceChange?: Quotation;
  /** Относительное изменение цены */
  priceChangeRel?: Quotation;
  /** Наименование инструмента */
  showName?: string;
}

/** Консенсус-прогноз */
export interface ConsensusItem {
  /** Уникальный идентификатор инструмента */
  uid?: string;
  /** Тикер инструмента */
  ticker?: string;
  /** Прогноз */
  recommendation?: Recommendation;
  /** Валюта */
  currency?: string;
  /** Текущая цена */
  currentPrice?: Quotation;
  /** Прогнозируемая цена (консенсус) */
  consensus?: Quotation;
  /** Минимальная цена прогноза */
  minTarget?: Quotation;
  /** Максимальная цена прогноза */
  maxTarget?: Quotation;
  /** Изменение цены */
  priceChange?: Quotation;
  /** Относительное изменение цены */
  priceChangeRel?: Quotation;
}

/** Ответ с прогнозами инвестдомов */
export interface GetForecastResponse {
  /** Массив прогнозов */
  targets?: TargetItem[];
  /** Согласованный прогноз */
  consensus?: ConsensusItem;
}

// 28. GetFuturesMargin

/** Запрос информации о фьючерсе */
export interface GetFuturesMarginRequest {
  /** FIGI (deprecated) */
  figi?: string;
  /** Идентификатор инструмента — figi или instrument_uid */
  instrumentId?: string;
}

/** Данные по фьючерсу (гарантийное обеспечение) */
export interface GetFuturesMarginResponse {
  /** Гарантийное обеспечение при покупке */
  initialMarginOnBuy?: MoneyValue;
  /** Гарантийное обеспечение при продаже */
  initialMarginOnSell?: MoneyValue;
  /** Шаг цены */
  minPriceIncrement?: Quotation;
  /** Стоимость шага цены */
  minPriceIncrementAmount?: Quotation;
}

// 29. GetInsiderDeals

/** Направление сделки инсайдера */
export enum TradeDirection {
  TRADE_DIRECTION_UNSPECIFIED = 0,
  /** Покупка */
  TRADE_DIRECTION_BUY = 1,
  /** Продажа */
  TRADE_DIRECTION_SELL = 2,
  /** Увеличение доли */
  TRADE_DIRECTION_INCREASE = 3,
  /** Уменьшение доли */
  TRADE_DIRECTION_DECREASE = 4,
}

/** Сделка инсайдера */
export interface InsiderDeal {
  /** Уникальный идентификатор сделки */
  tradeId?: number;
  /** Направление сделки */
  direction?: TradeDirection;
  /** Валюта сделки */
  currency?: string;
  /** Дата сделки */
  date?: Timestamp;
  /** Количество */
  quantity?: number;
  /** Цена */
  price?: Quotation;
  /** Уникальный идентификатор инструмента */
  instrumentUid?: string;
  /** Тикер инструмента */
  ticker?: string;
  /** Имя инвестора */
  investorName?: string;
  /** Отношение покупателя/продавца к эмитенту */
  investorPosition?: string;
  /** Купленный/проданный объём от общего количества, % */
  percentage?: number;
  /** Является ли сделкой реализацией опциона */
  isOptionExecution?: boolean;
  /** Дата раскрытия сделки */
  disclosureDate?: Timestamp;
}

/** Запрос сделок инсайдеров */
export interface GetInsiderDealsRequest {
  /** Идентификатор инструмента */
  instrumentId?: string;
  /** Лимит */
  limit?: number;
  /** Курсор для получения следующей страницы */
  nextCursor?: string;
}

/** Ответ со списком сделок инсайдеров */
export interface GetInsiderDealsResponse {
  /** Массив сделок */
  insiderDeals?: InsiderDeal[];
  /** Курсор для следующей страницы */
  nextCursor?: string;
}

// 30. GetInstrumentBy

/** Основная информация об инструменте (универсальный ответ) */
export interface Instrument {
  /** FIGI-идентификатор */
  figi?: string;
  /** Тикер */
  ticker?: string;
  /** Класс-код */
  classCode?: string;
  /** ISIN */
  isin?: string;
  /** Лотность */
  lot?: number;
  /** Валюта расчётов */
  currency?: string;
  /** Коэффициент ставки риска длинной позиции (deprecated) */
  klong?: Quotation;
  /** Коэффициент ставки риска короткой позиции (deprecated) */
  kshort?: Quotation;
  /** Ставка риска начальной маржи для КСУР лонг */
  dlong?: Quotation;
  /** Ставка риска начальной маржи для КСУР шорт */
  dshort?: Quotation;
  /** Ставка риска начальной маржи для КПУР лонг */
  dlongMin?: Quotation;
  /** Ставка риска начальной маржи для КПУР шорт */
  dshortMin?: Quotation;
  /** Признак доступности для операций в шорт */
  shortEnabledFlag?: boolean;
  /** Название инструмента */
  name?: string;
  /** Торговая площадка (секция биржи) */
  exchange?: string;
  /** Код страны риска */
  countryOfRisk?: string;
  /** Наименование страны риска */
  countryOfRiskName?: string;
  /** Тип инструмента (строка) */
  instrumentType?: string;
  /** Текущий режим торгов */
  tradingStatus?: SecurityTradingStatus;
  /** Признак внебиржевого инструмента (не используется) */
  otcFlag?: boolean;
  /** Признак доступности для покупки */
  buyAvailableFlag?: boolean;
  /** Признак доступности для продажи */
  sellAvailableFlag?: boolean;
  /** Шаг цены */
  minPriceIncrement?: Quotation;
  /** Возможность торговать через API */
  apiTradeAvailableFlag?: boolean;
  /** Уникальный идентификатор */
  uid?: string;
  /** Реальная площадка исполнения (биржа) */
  realExchange?: RealExchange;
  /** Уникальный идентификатор позиции */
  positionUid?: string;
  /** Уникальный идентификатор актива */
  assetUid?: string;
  /** Тесты, необходимые для совершения сделок */
  requiredTests?: string[];
  /** Доступность для ИИС */
  forIisFlag?: boolean;
  /** Только для квалифицированных инвесторов */
  forQualInvestorFlag?: boolean;
  /** Торговля по выходным */
  weekendFlag?: boolean;
  /** Флаг заблокированного ТКС */
  blockedTcaFlag?: boolean;
  /** Тип инструмента (enum) */
  instrumentKind?: InstrumentType;
  /** Дата первой минутной свечи */
  first1minCandleDate?: Timestamp;
  /** Дата первой дневной свечи */
  first1dayCandleDate?: Timestamp;
  /** Информация о бренде */
  brand?: BrandData;
  /** Ставка риска в лонг с учётом портфеля клиента */
  dlongClient?: Quotation;
  /** Ставка риска в шорт с учётом портфеля клиента */
  dshortClient?: Quotation;
}

/** Ответ с основной информацией об инструменте */
export interface InstrumentResponse {
  /** Инструмент */
  instrument?: Instrument;
}

// 31. GetRiskRates

/** Ставка риска */
export interface RiskRate {
  /** Категория риска */
  riskLevelCode?: string;
  /** Значение ставки риска */
  value?: Quotation;
}

/** Результат ставки риска для одного инструмента */
export interface RiskRateResult {
  /** Уникальный идентификатор инструмента */
  instrumentUid?: string;
  /** Ставка риска пользователя в шорт */
  shortRiskRate?: RiskRate;
  /** Ставка риска пользователя в лонг */
  longRiskRate?: RiskRate;
  /** Доступные ставки риска в шорт */
  shortRiskRates?: RiskRate[];
  /** Доступные ставки риска в лонг */
  longRiskRates?: RiskRate[];
  /** Ошибка */
  error?: string;
}

/** Запрос ставок риска */
export interface RiskRatesRequest {
  /** Идентификаторы инструментов */
  instrumentId?: string[];
}

/** Ответ со ставками риска */
export interface RiskRatesResponse {
  /** Массив результатов ставок риска */
  instrumentRiskRates?: RiskRateResult[];
}

// 32. Indicatives

/** Индикативный инструмент (индексы, товары и др.) */
export interface IndicativeResponse {
  /** FIGI-идентификатор */
  figi?: string;
  /** Тикер */
  ticker?: string;
  /** Класс-код */
  classCode?: string;
  /** Валюта расчетов */
  currency?: string;
  /** Тип инструмента */
  instrumentKind?: InstrumentType;
  /** Название инструмента */
  name?: string;
  /** Торговая площадка (секция биржи) */
  exchange?: string;
  /** Уникальный идентификатор */
  uid?: string;
  /** Признак доступности для покупки */
  buyAvailableFlag?: boolean;
  /** Признак доступности для продажи */
  sellAvailableFlag?: boolean;
}

/** Запрос справочника индикативных инструментов (пустой) */
export interface IndicativesRequest {}

/** Справочник индексов и товаров */
export interface IndicativesResponse {
  /** Массив индикативных инструментов */
  instruments?: IndicativeResponse[];
}

// 33. OptionBy

/** Тип опциона по направлению сделки */
export enum OptionDirection {
  OPTION_DIRECTION_UNSPECIFIED = 0,
  /** Опцион на продажу */
  OPTION_DIRECTION_PUT = 1,
  /** Опцион на покупку */
  OPTION_DIRECTION_CALL = 2,
}

/** Тип расчетов по опциону */
export enum OptionPaymentType {
  OPTION_PAYMENT_TYPE_UNSPECIFIED = 0,
  /** Премия в расчетах */
  OPTION_PAYMENT_TYPE_PREMIUM = 1,
  /** Маржируемые опционы */
  OPTION_PAYMENT_TYPE_MARGINAL = 2,
}

/** Тип опциона по стилю */
export enum OptionStyle {
  OPTION_STYLE_UNSPECIFIED = 0,
  /** Американский опцион */
  OPTION_STYLE_AMERICAN = 1,
  /** Европейский опцион */
  OPTION_STYLE_EUROPEAN = 2,
}

/** Тип опциона по способу исполнения */
export enum OptionSettlementType {
  OPTION_EXECUTION_TYPE_UNSPECIFIED = 0,
  /** Поставочный */
  OPTION_EXECUTION_TYPE_PHYSICAL_DELIVERY = 1,
  /** Расчетный */
  OPTION_EXECUTION_TYPE_CASH_SETTLEMENT = 2,
}

/** Опцион (полная информация) */
export interface Option {
  /** Уникальный идентификатор инструмента */
  uid?: string;
  /** Уникальный идентификатор позиции */
  positionUid?: string;
  /** Тикер */
  ticker?: string;
  /** Класс-код */
  classCode?: string;
  /** Уникальный идентификатор позиции основного инструмента */
  basicAssetPositionUid?: string;
  /** Текущий режим торгов */
  tradingStatus?: SecurityTradingStatus;
  /** Реальная площадка исполнения */
  realExchange?: RealExchange;
  /** Направление опциона */
  direction?: OptionDirection;
  /** Тип расчетов */
  paymentType?: OptionPaymentType;
  /** Стиль */
  style?: OptionStyle;
  /** Способ исполнения */
  settlementType?: OptionSettlementType;
  /** Название инструмента */
  name?: string;
  /** Валюта */
  currency?: string;
  /** Валюта, в которой оценивается контракт */
  settlementCurrency?: string;
  /** Тип актива */
  assetType?: string;
  /** Основной актив */
  basicAsset?: string;
  /** Торговая площадка */
  exchange?: string;
  /** Код страны рисков */
  countryOfRisk?: string;
  /** Наименование страны рисков */
  countryOfRiskName?: string;
  /** Сектор экономики */
  sector?: string;
  /** Информация о бренде */
  brand?: BrandData;
  /** Количество бумаг в лоте */
  lot?: number;
  /** Размер основного актива */
  basicAssetSize?: Quotation;
  /** Коэффициент ставки риска длинной позиции (deprecated) */
  klong?: Quotation;
  /** Коэффициент ставки риска короткой позиции (deprecated) */
  kshort?: Quotation;
  /** Ставка риска начальной маржи КСУР лонг */
  dlong?: Quotation;
  /** Ставка риска начальной маржи КСУР шорт */
  dshort?: Quotation;
  /** Ставка риска начальной маржи КПУР лонг */
  dlongMin?: Quotation;
  /** Ставка риска начальной маржи КПУР шорт */
  dshortMin?: Quotation;
  /** Минимальный шаг цены */
  minPriceIncrement?: Quotation;
  /** Цена страйка */
  strikePrice?: MoneyValue;
  /** Ставка риска в лонг с учётом портфеля клиента */
  dlongClient?: Quotation;
  /** Ставка риска в шорт с учётом портфеля клиента */
  dshortClient?: Quotation;
  /** Дата истечения срока */
  expirationDate?: Timestamp;
  /** Дата начала обращения контракта */
  firstTradeDate?: Timestamp;
  /** Дата исполнения */
  lastTradeDate?: Timestamp;
  /** Дата первой минутной свечи */
  first1minCandleDate?: Timestamp;
  /** Дата первой дневной свечи */
  first1dayCandleDate?: Timestamp;
  /** Признак доступности для шорт */
  shortEnabledFlag?: boolean;
  /** Возможность покупки/продажи на ИИС */
  forIisFlag?: boolean;
  /** Признак внебиржевого инструмента (устар.) */
  otcFlag?: boolean;
  /** Признак доступности для покупки */
  buyAvailableFlag?: boolean;
  /** Признак доступности для продажи */
  sellAvailableFlag?: boolean;
  /** Только для квалифицированных инвесторов */
  forQualInvestorFlag?: boolean;
  /** Торговля по выходным */
  weekendFlag?: boolean;
  /** Заблокированный ТКС */
  blockedTcaFlag?: boolean;
  /** Возможность торговать через API */
  apiTradeAvailableFlag?: boolean;
  /** Необходимые тесты */
  requiredTests?: string[];
}

/** Данные по опциону (ответ) */
export interface OptionResponse {
  /** Информация по опциону */
  instrument?: Option;
}

// 34. Options

/** Список опционов */
export interface OptionsResponse {
  /** Массив опционов */
  instruments?: Option[];
}

// 35. OptionsBy

/** Параметры фильтрации опционов */
export interface FilterOptionsRequest {
  /** Идентификатор базового актива опциона (обязательный) */
  basicAssetUid?: string;
  /** Идентификатор позиции базового актива опциона */
  basicAssetPositionUid?: string;
  /** Идентификатор базового инструмента (figi, instrument_uid или ticker+"_"+classCode) */
  basicInstrumentId?: string;
}

// 36. ShareBy

/** Объект передачи информации об акции */
export interface Share {
  /** FIGI-идентификатор */
  figi?: string;
  /** Тикер */
  ticker?: string;
  /** Класс-код (секция торгов) */
  classCode?: string;
  /** ISIN */
  isin?: string;
  /** Лотность */
  lot?: number;
  /** Валюта расчетов */
  currency?: string;
  /** Коэффициент ставки риска длинной позиции (deprecated) */
  klong?: Quotation;
  /** Коэффициент ставки риска короткой позиции (deprecated) */
  kshort?: Quotation;
  /** Ставка риска начальной маржи для КСУР лонг */
  dlong?: Quotation;
  /** Ставка риска начальной маржи для КСУР шорт */
  dshort?: Quotation;
  /** Ставка риска начальной маржи для КПУР лонг */
  dlongMin?: Quotation;
  /** Ставка риска начальной маржи для КПУР шорт */
  dshortMin?: Quotation;
  /** Признак доступности для операций в шорт */
  shortEnabledFlag?: boolean;
  /** Название инструмента */
  name?: string;
  /** Торговая площадка (секция биржи) */
  exchange?: string;
  /** Дата IPO акции по UTC */
  ipoDate?: Timestamp;
  /** Размер выпуска */
  issueSize?: number;
  /** Код страны риска */
  countryOfRisk?: string;
  /** Наименование страны риска */
  countryOfRiskName?: string;
  /** Сектор экономики */
  sector?: string;
  /** Плановый размер выпуска */
  issueSizePlan?: number;
  /** Номинал */
  nominal?: MoneyValue;
  /** Текущий режим торгов */
  tradingStatus?: SecurityTradingStatus;
  /** Признак внебиржевого инструмента (не используется) */
  otcFlag?: boolean;
  /** Признак доступности для покупки */
  buyAvailableFlag?: boolean;
  /** Признак доступности для продажи */
  sellAvailableFlag?: boolean;
  /** Признак наличия дивидендной доходности */
  divYieldFlag?: boolean;
  /** Тип акции */
  shareType?: ShareType;
  /** Шаг цены */
  minPriceIncrement?: Quotation;
  /** Возможность торговать через API */
  apiTradeAvailableFlag?: boolean;
  /** Уникальный идентификатор */
  uid?: string;
  /** Реальная площадка исполнения расчетов (биржа) */
  realExchange?: RealExchange;
  /** Уникальный идентификатор позиции */
  positionUid?: string;
  /** Уникальный идентификатор актива */
  assetUid?: string;
  /** Тип площадки торговли */
  instrumentExchange?: InstrumentExchangeType;
  /** Тесты, необходимые для совершения сделок */
  requiredTests?: string[];
  /** Доступность для ИИС */
  forIisFlag?: boolean;
  /** Только для квалифицированных инвесторов */
  forQualInvestorFlag?: boolean;
  /** Торговля по выходным */
  weekendFlag?: boolean;
  /** Флаг заблокированного ТКС */
  blockedTcaFlag?: boolean;
  /** Достаточная ликвидность */
  liquidityFlag?: boolean;
  /** Дата первой минутной свечи */
  first1minCandleDate?: Timestamp;
  /** Дата первой дневной свечи */
  first1dayCandleDate?: Timestamp;
  /** Информация о бренде */
  brand?: BrandData;
  /** Ставка риска в лонг с учётом портфеля клиента */
  dlongClient?: Quotation;
  /** Ставка риска в шорт с учётом портфеля клиента */
  dshortClient?: Quotation;
}

/** Данные по акции (ответ) */
export interface ShareResponse {
  /** Информация об акции */
  instrument?: Share;
}

// 37. Shares

/** Список акций */
export interface SharesResponse {
  /** Массив акций */
  instruments?: Share[];
}

// 38. StructuredNoteBy

/** Стратегия портфеля структурной ноты */
export enum LogicPortfolio {
  LOGIC_PORTFOLIO_UNSPECIFIED = 0,
  /** Волатильность */
  LOGIC_PORTFOLIO_VOLATILITY = 1,
  /** Корреляция */
  LOGIC_PORTFOLIO_CORRELATION = 2,
}

/** Принцип наблюдений структурной ноты */
export enum ObservationPrinciple {
  OBSERVATION_PRINCIPLE_UNSPECIFIED = 0,
  /** По худшему базовому активу */
  OBSERVATION_PRINCIPLE_WORST_BASIC_ASSET = 1,
  /** По лучшему базовому активу */
  OBSERVATION_PRINCIPLE_BEST_BASIC_ASSET = 2,
  /** Среднее значение по базовым активам */
  OBSERVATION_PRINCIPLE_AVERAGE_OF_BASIC_ASSETS = 3,
  /** Динамика актива (только если у ноты один базовый актив) */
  OBSERVATION_PRINCIPLE_SINGLE_BASIC_ASSET_PERFORMANCE = 4,
}

/** Тип доходности купона */
export enum YieldType {
  /** Тип доходности не определён */
  YIELD_TYPE_UNSPECIFIED = 0,
  /** Гарантированный купон */
  YIELD_TYPE_GUARANTED_COUPON = 1,
  /** Условный купон */
  YIELD_TYPE_CONDITIONAL_COUPON = 2,
  /** Участие в росте */
  YIELD_TYPE_PARTICIPATION = 3,
}

/** Базовый актив структурной ноты */
export interface BasicAsset {
  /** Уникальный идентификатор */
  uid?: string;
  /** Тип базового актива */
  type?: AssetType; // переиспользуем существующий AssetType
  /** Начальная цена базового актива */
  initialPrice?: Quotation;
}

/** Доходность по ноте */
export interface Yield {
  /** Тип доходности */
  type?: YieldType;
  /** Значение доходности */
  value?: Quotation;
}

/** Структурная нота */
export interface StructuredNote {
  /** Уникальный идентификатор инструмента */
  uid?: string;
  /** FIGI */
  figi?: string;
  /** Тикер */
  ticker?: string;
  /** Класс-код */
  classCode?: string;
  /** ISIN */
  isin?: string;
  /** Название */
  name?: string;
  /** Уникальный идентификатор актива */
  assetUid?: string;
  /** Уникальный идентификатор позиции */
  positionUid?: string;
  /** Шаг цены */
  minPriceIncrement?: Quotation;
  /** Лотность */
  lot?: number;
  /** Номинал */
  nominal?: MoneyValue;
  /** Валюта расчетов */
  currency?: string;
  /** Дата погашения */
  maturityDate?: Timestamp;
  /** Дата размещения */
  placementDate?: Timestamp;
  /** Форма выпуска */
  issueKind?: string;
  /** Размер выпуска */
  issueSize?: number;
  /** Плановый размер выпуска */
  issueSizePlan?: number;
  /** Ставка риска клиента в лонг */
  dlongClient?: Quotation;
  /** Ставка риска клиента в шорт */
  dshortClient?: Quotation;
  /** Доступность для шорт */
  shortEnabledFlag?: boolean;
  /** Торговая площадка */
  exchange?: string;
  /** Текущий режим торгов */
  tradingStatus?: SecurityTradingStatus;
  /** Возможность торговать через API */
  apiTradeAvailableFlag?: boolean;
  /** Признак доступности для покупки */
  buyAvailableFlag?: boolean;
  /** Признак доступности для продажи */
  sellAvailableFlag?: boolean;
  /** Доступность лимитной заявки */
  limitOrderAvailableFlag?: boolean;
  /** Доступность рыночной заявки */
  marketOrderAvailableFlag?: boolean;
  /** Доступность bestprice заявки */
  bestpriceOrderAvailableFlag?: boolean;
  /** Торговля по выходным */
  weekendFlag?: boolean;
  /** Достаточная ликвидность */
  liquidityFlag?: boolean;
  /** Возможность для ИИС */
  forIisFlag?: boolean;
  /** Только для квалифицированных инвесторов */
  forQualInvestorFlag?: boolean;
  /** Включение в ломбардный список */
  pawnshopListFlag?: boolean;
  /** Реальная площадка исполнения расчётов */
  realExchange?: RealExchange;
  /** Дата первой минутной свечи */
  first1minCandleDate?: Timestamp;
  /** Дата первой дневной свечи */
  first1dayCandleDate?: Timestamp;
  /** Название заемщика */
  borrowName?: string;
  /** Тип структурной ноты */
  type?: string;
  /** Стратегия портфеля */
  logicPortfolio?: LogicPortfolio;
  /** Тип базового актива (enum) */
  assetType?: AssetType;
  /** Базовые активы */
  basicAssets?: BasicAsset[];
  /** Барьер сохранности (в процентах) */
  safetyBarrier?: Quotation;
  /** Базис расчета НКД */
  couponPeriodBase?: string;
  /** Принцип наблюдений */
  observationPrinciple?: ObservationPrinciple;
  /** Частота наблюдений */
  observationFrequency?: string;
  /** Дата фиксации цен базовых активов */
  initialPriceFixingDate?: Timestamp;
  /** Доходность по ноте */
  yield?: Yield[];
  /** Признак сохранения купонов */
  couponSavingFlag?: boolean;
  /** Сектор экономики */
  sector?: string;
  /** Код страны рисков */
  countryOfRisk?: string;
  /** Наименование страны рисков */
  countryOfRiskName?: string;
  /** Имя файла логотипа эмитента */
  logoName?: string;
  /** Тесты, необходимые для покупки */
  requiredTests?: string[];
}

/** Ответ с данными по структурной ноте */
export interface StructuredNoteResponse {
  /** Информация о структурной ноте */
  instrument?: StructuredNote;
}

// 39. StructuredNotes

/** Список структурных нот */
export interface StructuredNotesResponse {
  /** Массив структурных нот */
  instruments?: StructuredNote[];
}

// 40. TradingSchedules

/** Запрос расписания торгов */
export interface TradingSchedulesRequest {
  /** Наименование биржи или расчетного календаря. Если не передаётся, возвращается информация по всем доступным площадкам */
  exchange?: string;
  /** Начало периода по UTC */
  from?: Timestamp;
  /** Окончание периода по UTC */
  to?: Timestamp;
}

/** Временной интервал */
export interface TimeInterval {
  /** Время начала интервала */
  startTs?: Timestamp;
  /** Время окончания интервала */
  endTs?: Timestamp;
}

/** Торговый интервал */
export interface TradingInterval {
  /** Название интервала */
  type?: string;
  /** Интервал */
  interval?: TimeInterval;
}

/** Информация о времени торгов в конкретный день */
export interface TradingDay {
  /** Дата */
  date?: Timestamp;
  /** Признак торгового дня на бирже */
  isTradingDay?: boolean;
  /** Время начала торгов по UTC */
  startTime?: Timestamp;
  /** Время окончания торгов по UTC */
  endTime?: Timestamp;
  /** Время начала аукциона открытия по UTC */
  openingAuctionStartTime?: Timestamp;
  /** Время окончания аукциона закрытия по UTC */
  closingAuctionEndTime?: Timestamp;
  /** Время начала аукциона открытия вечерней сессии по UTC */
  eveningOpeningAuctionStartTime?: Timestamp;
  /** Время начала вечерней сессии по UTC */
  eveningStartTime?: Timestamp;
  /** Время окончания вечерней сессии по UTC */
  eveningEndTime?: Timestamp;
  /** Время начала основного клиринга по UTC */
  clearingStartTime?: Timestamp;
  /** Время окончания основного клиринга по UTC */
  clearingEndTime?: Timestamp;
  /** Время начала премаркета по UTC */
  premarketStartTime?: Timestamp;
  /** Время окончания премаркета по UTC */
  premarketEndTime?: Timestamp;
  /** Время начала аукциона закрытия по UTC */
  closingAuctionStartTime?: Timestamp;
  /** Время окончания аукциона открытия по UTC */
  openingAuctionEndTime?: Timestamp;
  /** Торговые интервалы */
  intervals?: TradingInterval[];
}

/** Данные по торговой площадке */
export interface TradingSchedule {
  /** Наименование торговой площадки */
  exchange?: string;
  /** Массив с торговыми и неторговыми днями */
  days?: TradingDay[];
}

/** Список торговых площадок */
export interface TradingSchedulesResponse {
  /** Список торговых площадок и режимов торгов */
  exchanges?: TradingSchedule[];
}

