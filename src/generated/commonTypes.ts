// src/api/tbank/commonTypes.ts

/** Дата и время в UTC (google.protobuf.Timestamp) */
export interface Timestamp {
  seconds?: number | string;  // обычно число, но может быть строка
  nanos?: number;
}

/** Денежная сумма в определённой валюте */
export interface MoneyValue {
  /** Строковый ISO-код валюты */
  currency?: string;
  /** Целая часть суммы, может быть отрицательным числом */
  units?: number;
  /** Дробная часть суммы, может быть отрицательным числом */
  nano?: number;
}

/** Котировка – денежная сумма без указания валюты */
export interface Quotation {
  /** Целая часть суммы, может быть отрицательным числом */
  units?: string | number;
  /** Дробная часть суммы, может быть отрицательным числом */
  nano?: number;
}

/** Метадата ответа */
export interface ResponseMetadata {
  /** Идентификатор трекинга */
  trackingId?: string;
  /** Серверное время */
  serverTime?: Timestamp;
}

/** Настройки пинга для стрима */
export interface PingDelaySettings {
  /** Задержка (пинг) сообщений: 5000–180 000 миллисекунд. Значение по умолчанию — 120 000 */
  pingDelayMs?: number;
}