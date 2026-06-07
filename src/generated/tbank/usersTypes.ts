// Типы из tinkoff.public.invest.api.contract.v1 (proto3)

/** Дата и время в UTC (google.protobuf.Timestamp) */
export type Timestamp = string; // Обычно используется ISO 8601

// ==================== Первый proto-файл ====================

/** Запрос информации о пользователе. */
export interface GetInfoRequest {}

/** Информация о пользователе. */
export interface GetInfoResponse {
  /** Признак премиум клиента. */
  premStatus?: boolean;
  /** Признак квалифицированного инвестора. */
  qualStatus?: boolean;
  /** Набор требующих тестирования инструментов и возможностей, с которыми может работать пользователь. [Подробнее](/invest/services/accounts/faq_users). */
  qualifiedForWorkWith?: string[];
  /** Наименование тарифа пользователя. */
  tariff?: string;
  /** Идентификатор пользователя. */
  userId?: string;
  /** Категория риска. */
  riskLevelCode?: string;
}

// ==================== Второй proto-файл ====================

/** Статус счeта. */
export enum AccountStatus {
  /** Статус счeта не определeн. */
  ACCOUNT_STATUS_UNSPECIFIED = 0,
  /** Новый, в процессе открытия. */
  ACCOUNT_STATUS_NEW = 1,
  /** Открытый и активный счeт. */
  ACCOUNT_STATUS_OPEN = 2,
  /** Закрытый счeт. */
  ACCOUNT_STATUS_CLOSED = 3,
  /** Все счета. */
  ACCOUNT_STATUS_ALL = 4,
}

/** Тип счeта. */
export enum AccountType {
  /** Тип аккаунта не определeн. */
  ACCOUNT_TYPE_UNSPECIFIED = 0,
  /** Брокерский счeт Т-Инвестиций. */
  ACCOUNT_TYPE_TINKOFF = 1,
  /** ИИС. */
  ACCOUNT_TYPE_TINKOFF_IIS = 2,
  /** Инвесткопилка. */
  ACCOUNT_TYPE_INVEST_BOX = 3,
  /** Фонд денежного рынка. */
  ACCOUNT_TYPE_INVEST_FUND = 4,
  /** Дебетовый карточный счeт. */
  ACCOUNT_TYPE_DEBIT = 5,
  /** Накопительный счeт. */
  ACCOUNT_TYPE_SAVING = 6,
}

/** Уровень доступа к счeту. */
export enum AccessLevel {
  /** Уровень доступа не определeн. */
  ACCOUNT_ACCESS_LEVEL_UNSPECIFIED = 0,
  /** Полный доступ к счeту. */
  ACCOUNT_ACCESS_LEVEL_FULL_ACCESS = 1,
  /** Доступ с уровнем прав «только чтение». */
  ACCOUNT_ACCESS_LEVEL_READ_ONLY = 2,
  /** Доступа нет. */
  ACCOUNT_ACCESS_LEVEL_NO_ACCESS = 3,
}

/** Запрос получения счетов пользователя. */
export interface GetAccountsRequest {
  /** Статус счета. */
  status?: AccountStatus;
}

/** Информация о счeте. */
export interface Account {
  /** Идентификатор счeта. */
  id?: string;
  /** Тип счeта. */
  type?: AccountType;
  /** Название счeта. */
  name?: string;
  /** Статус счeта. */
  status?: AccountStatus;
  /** Дата открытия счeта в часовом поясе UTC. */
  openedDate?: Timestamp;
  /** Дата закрытия счeта в часовом поясе UTC. */
  closedDate?: Timestamp;
  /** Уровень доступа к текущему счeту (определяется токеном). */
  accessLevel?: AccessLevel;
}

/** Список счетов пользователя. */
export interface GetAccountsResponse {
  /** Массив счетов клиента. */
  accounts?: Account[];
}

// ==================== Третий proto-файл ====================

/** Денежная сумма в определенной валюте. */
export interface MoneyValue {
  /** Строковый ISO-код валюты. */
  currency?: string;
  /** Целая часть суммы, может быть отрицательным числом. */
  units?: number;
  /** Дробная часть суммы, может быть отрицательным числом. */
  nano?: number;
}

/** Банковский счeт. */
export interface BankAccount {
  /** Идентификатор счeта. */
  id?: string;
  /** Название счeта. */
  name?: string;
  /** Список валютных позиций на счeте. */
  money?: MoneyValue[];
  /** Дата открытия счeта в часовом поясе UTC. */
  openedDate?: Timestamp;
  /** Тип счeта. */
  type?: AccountType;
}

/** Запрос списка банковских счетов пользователя. */
export interface GetBankAccountsRequest {}

/** Список банковских счетов пользователя. */
export interface GetBankAccountsResponse {
  /** Массив банковских счетов. */
  bankAccounts?: BankAccount[];
}

// ==================== Четвёртый proto-файл ====================

/** Запрос перевода денежных средств между счетами. */
export interface CurrencyTransferRequest {
  /** Номер счета списания. */
  fromAccountId?: string;
  /** Номер счета зачисления. */
  toAccountId?: string;
  /** Сумма перевода с указанием валюты. */
  amount?: MoneyValue;
  /** Идентификатор запроса выставления поручения для целей идемпотентности в формате UUID. */
  transactionId?: string;
}

/** Ответ на запрос перевода денежных средств. */
export interface CurrencyTransferResponse {}

// ==================== Пятый proto-файл ====================

/** Котировка — денежная сумма без указания валюты. */
export interface Quotation {
  /** Целая часть суммы, может быть отрицательным числом. */
  units?: number;
  /** Дробная часть суммы, может быть отрицательным числом. */
  nano?: number;
}

/** Запрос маржинальных показателей по счeту. */
export interface GetMarginAttributesRequest {
  /** Идентификатор счeта пользователя. */
  accountId?: string;
}

/** Маржинальные показатели по счeту. */
export interface GetMarginAttributesResponse {
  /** Ликвидная стоимость портфеля. [Подробнее про ликвидный портфель](https://www.tbank.ru/invest/help/brokerage/account/margin/about/#q4). */
  liquidPortfolio?: MoneyValue;
  /** Начальная маржа — начальное обеспечение для совершения новой сделки. [Подробнее про начальную и минимальную маржу](https://www.tbank.ru/invest/help/brokerage/account/margin/about/#q6). */
  startingMargin?: MoneyValue;
  /** Минимальная маржа — это минимальное обеспечение для поддержания позиции, которую вы уже открыли. [Подробнее про начальную и минимальную маржу](https://www.tbank.ru/invest/help/brokerage/account/margin/about/#q6). */
  minimalMargin?: MoneyValue;
  /** Уровень достаточности средств. Соотношение стоимости ликвидного портфеля к начальной марже. */
  fundsSufficiencyLevel?: Quotation;
  /** Объем недостающих средств. Разница между стартовой маржой и ликвидной стоимости портфеля. */
  amountOfMissingFunds?: MoneyValue;
  /** Скорректированная маржа. Начальная маржа, в которой плановые позиции рассчитываются с учeтом активных заявок на покупку позиций лонг или продажу позиций шорт. */
  correctedMargin?: MoneyValue;
}

// ==================== Шестой proto-файл ====================

/** Лимит unary-методов. */
export interface UnaryLimit {
  /** Количество unary-запросов в минуту. */
  limitPerMinute?: number;
  /** Названия методов. */
  methods?: string[];
  /** Количество unary-запросов в секунду. */
  limitPerSecond?: number;
}

/** Лимит stream-соединений. */
export interface StreamLimit {
  /** Максимальное количество stream-соединений. */
  limit?: number;
  /** Названия stream-методов. */
  streams?: string[];
  /** Текущее количество открытых stream-соединений. */
  open?: number;
}

/** Запрос текущих лимитов пользователя. */
export interface GetUserTariffRequest {}

/** Текущие лимиты пользователя. */
export interface GetUserTariffResponse {
  /** Массив лимитов пользователя по unary-запросам. */
  unaryLimits?: UnaryLimit[];
  /** Массив лимитов пользователей для stream-соединений. */
  streamLimits?: StreamLimit[];
}

// ==================== Седьмой proto-файл ====================

/** Запрос пополнения брокерского счета. */
export interface PayInRequest {
  /** Номер счета списания. */
  fromAccountId?: string;
  /** Номер брокерского счета зачисления. */
  toAccountId?: string;
  /** Сумма перевода с указанием валюты. */
  amount?: MoneyValue;
}

/** Ответ на запрос пополнения брокерского счета. */
export interface PayInResponse {}
