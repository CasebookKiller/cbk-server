// src/api/tbank/sandbox-types.ts

import { MoneyValue } from '../commonTypes';

/** Запрос закрытия счета в песочнице */
export interface CloseSandboxAccountRequest {
  /** Номер счета */
  accountId?: string;
}

/** Результат закрытия счета в песочнице (пустой) */
export interface CloseSandboxAccountResponse {}

/** Запрос открытия счета в песочнице */
export interface OpenSandboxAccountRequest {
  /** Название счета (опционально) */
  name?: string;
}

/** Номер открытого счета в песочнице */
export interface OpenSandboxAccountResponse {
  /** Номер счета */
  accountId?: string;
}

/** Запрос пополнения счета в песочнице */
export interface SandboxPayInRequest {
  /** Номер счета */
  accountId?: string;
  /** Сумма пополнения счета в рублях */
  amount?: MoneyValue;
}

/** Результат пополнения счета, текущий баланс */
export interface SandboxPayInResponse {
  /** Текущий баланс счета */
  balance?: MoneyValue;
}