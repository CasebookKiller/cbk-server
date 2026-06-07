export interface IIBondValue {
  currency: string;
  units: string;
  nano: number;
}

// Котировка — денежная сумма без указания валюты.
export interface TIQuotation {
  // Целая часть суммы, может быть отрицательным числом.
  units: number;
  // Дробная часть суммы, может быть отрицательным числом.
  nano: number;
} 


// Денежная сумма в определенной валюте.
export interface TIMoneyValue {
  // Строковый ISO-код валюты.
  currency: string;
  // Целая часть суммы, может быть отрицательным числом.
  units: number;
  // Дробная часть суммы, может быть отрицательным числом.
  nano: number;
}

// Объект передачи информации об облигации.
export interface TIBond {
  // FIGI-идентификатор инструмента. 1
  figi: string;                       //"figi": "BBG00XH4W3N3"
  // Тикер инструмента. 2
  ticker: string;                     //"ticker": "RU000A101RZ3"
  // Класс-код (секция торгов). 3
  classCode: string;                  //"classCode": "TQCB"
  // ISIN-идентификатор инструмента. 4
  isin: string;                       //"isin": "RU000A101RZ3"
  // Лотность инструмента. Возможно совершение операций только на количества ценной бумаги, кратные параметру `lot`. [Подробнее](./glossary#lot). 5
  lot: number;                        //"lot": 1
  // Валюта расчетов. 6
  currency: string;                   //"currency": "rub"
  // Коэффициент ставки риска длинной позиции по клиенту. 2 – клиент со стандартным уровнем риска (КСУР); 1 – клиент с повышенным уровнем риска (КПУР). 7
  // klong: {};                       // Quotation klong = 7 [deprecated = true];
  // Коэффициент ставки риска короткой позиции по клиенту. 2 – клиент со стандартным уровнем риска (КСУР); 1 – клиент с повышенным уровнем риска (КПУР). 8
  // kshort: {};                      // Quotation kshort = 8 [deprecated = true];
  // Ставка риска начальной маржи для КСУР лонг. [Подробнее про ставки риска](https://www.tbank.ru/invest/help/brokerage/account/margin/about/#q5). 9
  // dlong: {};                       // Quotation dlong = 9;
  // Ставка риска начальной маржи для КСУР шорт. [Подробнее про ставки риска](https://www.tbank.ru/invest/help/brokerage/account/margin/about/#q5). 10
  // dshort: {};                      // Quotation dshort = 10;
  // Ставка риска начальной маржи для КПУР лонг. [Подробнее про ставки риска](https://www.tbank.ru/invest/help/brokerage/account/margin/about/#q5). 11
  // dlong_min: {};                   // Quotation dlong_min = 11;
  // Ставка риска начальной маржи для КПУР шорт. [Подробнее про ставки риска](https://www.tbank.ru/invest/help/brokerage/account/margin/about/#q5). 12
  // dshort_min: {};                  // Quotation dshort_min = 12;
  // Признак доступности для операций в шорт. 13
  shortEnabledFlag: boolean;          //"shortEnabledFlag": false
  // Название инструмента. 15
  name: string;                       //"name": "Казахстан выпуск 11"
  // Tорговая площадка (секция биржи). 16
  exchange: string;                   //"exchange": "moex_plus_bonds"
  // Количество выплат по купонам в год. 17
  couponQuantityPerYear: number;      //"couponQuantityPerYear": 2
  // Дата погашения облигации по UTC. 18
  maturityDate: string;               //"maturityDate": "2030-09-11T00:00:00.000Z"
  // Номинал облигации. 19
  nominal: {
    currency: string;                 //"currency": "rub"
    units: number;                    //--- string --- //"units": 1000
    nano: number;                     //"nano": 0
  };
  // Первоначальный номинал облигации. 20
  initialNominal: {
    currency: string;                 //"currency": "rub"
    units: number;                    //--- string --- //"units": 1000
    nano: number;                     //"nano": 0
  };
  // Дата выпуска облигации по UTC. 21
  stateRegDate: string;               //"stateRegDate": "2020-07-16T00:00:00.000Z"
  // Дата размещения по UTC. 22
  placementDate: string;              //"placementDate": "2020-09-23T00:00:00.000Z"
  // Цена размещения. 23
  placementPrice: {
    currency: string;                 //"currency": "rub"
    units: number;                    //--- string --- //"units": 1000
    nano: number;                     //"nano": 0
  };
  // Значение НКД (накопленного купонного дохода) на дату. 24
  aciValue: {
    currency: string;                 //"currency": "rub"
    units: number;                    //--- string --- //"units": 22
    nano: number;                     //"nano": 440000000
  };
  // Код страны риска — то есть страны, в которой компания ведет основной бизнес. 25
  countryOfRisk: string;              //"countryOfRisk": "KZ"
  // Наименование страны риска — то есть страны, в которой компания ведет основной бизнес. 26
  countryOfRiskName: string;          //"countryOfRiskName": "Республика Казахстан"
  // Сектор экономики. 27
  sector: string;                     //"sector": "government"
  // Форма выпуска. Возможные значения: <br/>**documentary** — документарная; <br/>**non_documentary** — бездокументарная. 28
  issueKind: string;                  //"issueKind": "non_documentary"
  // Размер выпуска. 29
  issueSize: number;                  //--- string --- //"issueSize": 10000000
  // Плановый размер выпуска. 30
  issueSizePlan: number;              //--- string --- //"issueSizePlan": 10000000
  // Текущий режим торгов инструмента. 31
  tradingStatus: number;              //--- string --- //"tradingStatus": 1
  // Флаг, используемый ранее для определения внебиржевых инструментов. На данный момент не используется для торгуемых через API инструментов. Может использоваться как фильтр для операций, совершавшихся некоторое время назад на ОТС площадке. 32
  otcFlag: boolean;                   //"otcFlag": false
  // Признак доступности для покупки. 33
  buyAvailableFlag: boolean;          //"buyAvailableFlag": true
  // Признак доступности для продажи. 34
  sellAvailableFlag: boolean;         //"sellAvailableFlag": true
  // Признак облигации с плавающим купоном. 35
  floatingCouponFlag: boolean;        //"floatingCouponFlag": false
  // Признак бессрочной облигации. 36
  perpetualFlag: boolean;             //"perpetualFlag": false
  // Признак облигации с амортизацией долга. 37
  amortizationFlag: boolean;          //"amortizationFlag": false
  // Шаг цены. 38
  minPriceIncrement: {
    units: number;                    //--- string --- //"units": 0
    nano: number;                     //"nano": 10000000
  };
  // Параметр указывает на возможность торговать инструментом через API. 39
  apiTradeAvailableFlag: boolean;     //"apiTradeAvailableFlag": true
  // Уникальный идентификатор инструмента. 40
  uid: string;                        //"uid": "2dd3b003-aca2-4920-89ce-8d827c637372"
  // Реальная площадка исполнения расчетов. (биржа) 41
  realExchange: number;               //--- string --- //"realExchange": 1
  // Уникальный идентификатор позиции инструмента. 42
  positionUid: string;                //"positionUid": "2c354d2c-98d0-4705-8370-92e604e31ece"
  // Уникальный идентификатор актива. 43
  assetUid: string;                   //"assetUid": "28887b0a-20a8-409d-b895-e9831a56152e"
  // Тесты, которые необходимо пройти клиенту, чтобы совершать сделки по инструменту. 44
  requiredTests: string[];            //"requiredTests": []
  // Признак доступности для ИИС. 51
  forIisFlag: boolean;                //"forIisFlag": false
  // Флаг, отображающий доступность торговли инструментом только для квалифицированных инвесторов. 52
  forQualInvestorFlag: boolean;       //"forQualInvestorFlag": false
  // Флаг, отображающий доступность торговли инструментом по выходным. 53
  weekendFlag: boolean;               //"weekendFlag": false
  // Флаг заблокированного ТКС. 54
  blockedTcaFlag: boolean;             //"blockedTcaFlag": false
  // Признак субординированной облигации. 55
  subordinatedFlag: boolean;          //"subordinatedFlag": false
  // Флаг достаточной ликвидности. 56
  liquidityFlag: boolean;             //"liquidityFlag": true
  // Дата первой минутной свечи. 61
  first1minCandleDate: string;        //--- none --- //"first1minCandleDate": "2020-09-23T11:09:00.000Z"
  // Дата первой дневной свечи. 62
  first1dayCandleDate: string;        //--- none --- //"first1dayCandleDate": "2020-09-23T07:00:00.000Z"
  // Уровень риска. 63
  riskLevel: number;                  //--- string --- //"riskLevel": 1
  // Информация о бренде. 64
  brand: {
    logoName: string;                 //"logoName": "RU000A101RP4.png"
    logoBaseColor: string;            //"logoBaseColor": "#000000"
    textColor: string;                //"textColor": "#ffffff"
  };
  // Тип облигации. 65
  bondType: number;                   //--- string --- //"bondType": 0
  // Дата погашения облигации. 69
  // call_date: string;               //google.protobuf.Timestamp call_date = 69;
  // Ставка риска в лонг с учетом текущего уровня риска портфеля клиента. [Подробнее про ставки риска](https://www.tbank.ru/invest/help/brokerage/account/margin/about/#q5). 90
  // dlong_client: {};                //Quotation dlong_client = 90;
  // Ставка риска в шорт с учетом текущего уровня риска портфеля клиента. [Подробнее про ставки риска](https://www.tbank.ru/invest/help/brokerage/account/margin/about/#q5). 91
  // dshort_client: {};               //Quotation dshort_client = 91;
}


export interface IBond {
  // FIGI-идентификатор инструмента. 1
  figi: string;
  // Тикер инструмента. 2
  ticker: string;
  // Класс-код (секция торгов). 3
  classCode: string;
  // ISIN-код инструмента. 4
  isin: string;
  // Лотность инструмента. Возможно совершение операций только на количества ценной бумаги, кратные параметру `lot`. [Подробнее](./glossary#lot). 5
  lot: number;
  // Валюта расчетов. 6
  currency: string;
  // Признак доступности для операций в шорт. 13
  shortEnabledFlag: boolean;
  // Название инструмента. 14
  name: string;
  // Tорговая площадка (секция биржи). 16
  exchange: string;
  // Количество выплат по купонам в год. 17
  couponQuantityPerYear: number;
  // Дата погашения облигации по UTC. 18
  maturityDate: string;
  // Номинал облигации. 19
  nominal: IIBondValue;
  // Первоначальный номинал облигации. 20
  initialNominal: IIBondValue;
  // Дата выпуска облигации по UTC. 21
  stateRegDate: string;
  // Дата размещения по UTC. 22
  placementDate: string;
  // Цена размещения. 23
  placementPrice: IIBondValue;
  // Значение НКД (накопленного купонного дохода) на дату. 24
  aciValue: IIBondValue;
  // Код страны риска — то есть страны, в которой компания ведет основной бизнес. 25
  countryOfRisk: string;
  // Наименование страны риска — то есть страны, в которой компания ведет основной бизнес. 26
  countryOfRiskName: string;
  // Сектор экономики. 27
  sector: string;
  // Форма выпуска. Возможные значения: <br/>**documentary** — документарная; <br/>**non_documentary** — бездокументарная. 28
  issueKind: string;
  // Размер выпуска. 29
  issueSize: string;
  // Плановый размер выпуска. 30
  issueSizePlan: string;
  // Текущий режим торгов инструмента. 31
  tradingStatus: string;
  // Флаг, используемый ранее для определения внебиржевых инструментов. На данный момент не используется для торгуемых через API инструментов. Может использоваться как фильтр для операций, совершавшихся некоторое время назад на ОТС площадке. 32
  otcFlag: boolean;
  // Признак доступности для покупки. 33
  buyAvailableFlag: boolean;
  // Признак доступности для продажи. 34
  sellAvailableFlag: boolean;
  // Признак облигации с плавающим купоном. 35
  floatingCouponFlag: boolean;
  // Признак бессрочной облигации. 36
  perpetualFlag: boolean;
  // Признак облигации с амортизацией долга. 37
  amortizationFlag: boolean;
  // Шаг цены. 38
  minPriceIncrement: {
    units: string;
    nano: number;
  };
  // Параметр указывает на возможность торговать инструментом через API. 39
  apiTradeAvailableFlag: boolean;
  // Уникальный идентификатор инструмента. 40
  uid: string;
  // Реальная площадка исполнения расчетов. (биржа) 41
  realExchange: string;
  // Уникальный идентификатор позиции инструмента. 42
  positionUid: string;
  // Уникальный идентификатор актива. 43
  assetUid: string;
  // Тесты, которые необходимо пройти клиенту, чтобы совершать сделки по инструменту. 44
  requiredTests: string[];
  // Признак доступности для ИИС. 51
  forIisFlag: boolean;
  // Флаг, отображающий доступность торговли инструментом только для квалифицированных инвесторов. 52
  forQualInvestorFlag: boolean;
  // Флаг, отображающий доступность торговли инструментом по выходным. 53
  weekendFlag: boolean;
  // Флаг заблокированного ТКС. 54
  blockedTcaFlag: boolean;
  // Признак субординированной облигации. 55
  subordinatedFlag: boolean;
  // Флаг достаточной ликвидности. 56
  liquidityFlag: boolean;
  // Дата первой минутной свечи. 61
  first1minCandleDate?: string;
  // Дата первой дневной свечи. 62
  first1dayCandleDate?: string;
  // Уровень риска. 63
  riskLevel: string;
  // Информация о бренде. 64
  brand: {
    logoName: string;
    logoBaseColor: string;
    textColor: string;
  };
  // Тип облигации. 65
  bondType: string;
}
export interface IBonds {
  instruments: IBond[];
}

// Режим торгов инструмента
export enum SecurityTradingStatus {
  // Торговый статус не определен.
  SECURITY_TRADING_STATUS_UNSPECIFIED = 0,
  // Недоступен для торгов.
  SECURITY_TRADING_STATUS_NOT_AVAILABLE_FOR_TRADING = 1,
  // Период открытия торгов.
  SECURITY_TRADING_STATUS_OPENING_PERIOD = 2,
  // Период закрытия торгов.
  SECURITY_TRADING_STATUS_CLOSING_PERIOD = 3,
  // Перерыв в торговле.
  SECURITY_TRADING_STATUS_BREAK_IN_TRADING = 4,
  // Нормальная торговля.
  SECURITY_TRADING_STATUS_NORMAL_TRADING = 5,
  // Аукцион закрытия.
  SECURITY_TRADING_STATUS_CLOSING_AUCTION = 6,
  // Аукцион крупных пакетов.
  SECURITY_TRADING_STATUS_DARK_POOL_AUCTION = 7,
  // Дискретный аукцион.
  SECURITY_TRADING_STATUS_DISCRETE_AUCTION = 8,
  // Аукцион открытия.
  SECURITY_TRADING_STATUS_OPENING_AUCTION_PERIOD = 9,
  // Период торгов по цене аукциона закрытия.
  SECURITY_TRADING_STATUS_TRADING_AT_CLOSING_AUCTION_PRICE = 10,
  // Сессия назначена.
  SECURITY_TRADING_STATUS_SESSION_ASSIGNED = 11,
  // Сессия закрыта.
  SECURITY_TRADING_STATUS_SESSION_CLOSE = 12,
  // Сессия открыта.
  SECURITY_TRADING_STATUS_SESSION_OPEN = 13,
  // Доступна торговля в режиме внутренней ликвидности брокера.
  SECURITY_TRADING_STATUS_DEALER_NORMAL_TRADING = 14,
  // Перерыв торговли в режиме внутренней ликвидности брокера.
  SECURITY_TRADING_STATUS_DEALER_BREAK_IN_TRADING = 15,
  // Недоступна торговля в режиме внутренней ликвидности брокера.
  SECURITY_TRADING_STATUS_DEALER_NOT_AVAILABLE_FOR_TRADING = 16,
}

// Реальная площадка исполнения расчетов.
export enum RealExchange {
  // Тип не определен.
  REAL_EXCHANGE_UNSPECIFIED = 0,
  // Московская биржа.
  REAL_EXCHANGE_MOEX = 1,
  // Санкт-Петербургская биржа.
  REAL_EXCHANGE_RTS = 2,
  // Внебиржевой инструмент.
  REAL_EXCHANGE_OTC = 3,
  // Инструмент, торгуемый на площадке брокера.
  REAL_EXCHANGE_DEALER = 4,
}

// Уровень риска облигации.
export enum RiskLevel {
  // Не указан.
  RISK_LEVEL_UNSPECIFIED = 0,
  // Низкий уровень риска.
  RISK_LEVEL_LOW = 1,
  // Средний уровень риска.
  RISK_LEVEL_MODERATE = 2,
  // Высокий уровень риска.
  RISK_LEVEL_HIGH = 3,
}

export enum BondType {
  // Тип облигации не определен.
  BOND_TYPE_UNSPECIFIED = 0,
  // Замещающая облигация.
  BOND_TYPE_REPLACED = 1,
}

export function getBondType(code: number): string {
  return BondType[code];
}

export interface IBondEvent {
  // Идентификатор инструмента. 2
  instrumentId: string;
  // Номер события для данного типа события. 3
  eventNumber: number;
  // Дата события. 4
  eventDate: string;
  // Тип события. 5
  eventType: string;
  // Полное количество бумаг, задействованных в событии. 6
  eventTotalVol: { units: string; nano: number };
  // Дата фиксации владельцев для участия в событии. 7
  fixDate: string;
  // Дата определения даты или факта события. 8
  rateDate: string;
  // Дата дефолта, если применимо. 9 
  defaultDate: string;
  // Дата реального исполнения обязательства. 10
  realPayDate: string;
  // Дата выплаты. 11
  payDate: string;
  // Выплата на одну облигацию. 12
  payOneBond: IIBondValue;
  // Выплаты на все бумаги, задействованные в событии. 13
  moneyFlowVal: IIBondValue;
  // Признак исполнения. 14
  execution: string;
  // Тип операции. 15
  operationType: string;
  // Стоимость операции — ставка купона, доля номинала, цена выкупа или коэффициент конвертации. 16
  value: { units: string, nano: number };
  // Примечание. 17
  note: string;
  // ID выпуска бумаг, в который произведена конвертация (для конвертаций). 18
  convertToFinToolId: string;
  // Начало купонного периода. 19
  couponStartDate: string;
  // Окончание купонного периода. 20
  couponEndDate: string;
  // Купонный период. 21
  couponPeriod: number;
  // Ставка купона, процентов годовых. 22
  couponInterestRate: { units: string, nano: number }
}

export interface TIBondEvent {
  // Идентификатор инструмента. 2
  instrumentId: string;
  // Номер события для данного типа события. 3
  eventNumber: number;
  // Дата события. 4
  eventDate: string;
  // Тип события. 5
  eventType: number;
  // Полное количество бумаг, задействованных в событии.6
  eventTotalVol: TIQuotation;
  // Дата фиксации владельцев для участия в событии. 7
  fixDate: string;
  // Дата определения даты или факта события. 8
  rateDate: string;
  // Дата дефолта, если применимо. 9 
  // defaultDate: string;
  // Дата реального исполнения обязательства. 10
  realPayDate: string;
  // Дата выплаты. 11
  payDate: string;
  // Выплата на одну облигацию. 12
  payOneBond: TIMoneyValue;
  // Выплаты на все бумаги, задействованные в событии. 13
  moneyFlowVal: TIMoneyValue;
  // Признак исполнения. 14
  execution: string;
  // Тип операции. 15
  operationType: string; 
  // Стоимость операции — ставка купона, доля номинала, цена выкупа или коэффициент конвертации. 16
  value: TIQuotation;
  // Примечание. 17
  note: string;
  // ID выпуска бумаг, в который произведена конвертация (для конвертаций). 18
  convertToFinToolId: string;
  // Начало купонного периода. 19
  couponStartDate: string;
  // Окончание купонного периода. 20
  couponEndDate: string;
  // Купонный период. 21
  couponPeriod: number;
  // Ставка купона, процентов годовых. 22
  couponInterestRate: TIQuotation;
}

// Котировка — денежная сумма без указания валюты.
export interface IQuotation {
  // Целая часть суммы, может быть отрицательным числом. 1
  units: number;
  // Дробная часть суммы, может быть отрицательным числом. 2
  nano: number;
}

// Денежная сумма в определенной валюте.
export interface IMoneyValue {
  // Строковый ISO-код валюты. 1
  currency: string;
  // Целая часть суммы, может быть отрицательным числом. 2
  units: number;
  // Дробная часть суммы, может быть отрицательным числом. 3
  nano: number;
}

export enum EventType {
  // Неопределенное значение.
  'EVENT_TYPE_UNSPECIFIED' = 0,
  // Купон.
  'EVENT_TYPE_CPN' = 1,
  // Опцион (оферта).
  'EVENT_TYPE_CALL' = 2,
  // Погашение.
  'EVENT_TYPE_MTY' = 3,
  // Конвертация.
  'EVENT_TYPE_CONV' = 4,
}

