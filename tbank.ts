//import { TinkoffInvestApi } from "tinkoff-invest-api";
import { TOKEN } from "./common/common";
//import { PortfolioRequest_CurrencyRequest } from "tinkoff-invest-api/cjs/generated/operations";
//import { FindInstrumentRequest, InstrumentIdType, InstrumentRequest, InstrumentShort, InstrumentsRequest } from "tinkoff-invest-api/cjs/generated/instruments";
//import { AccessLevel, AccountStatus, GetAccountsRequest } from 'tinkoff-invest-api/cjs/generated/users';

import { createSdk } from './t-invest-sdk/sdk';
import { PortfolioRequest_CurrencyRequest } from './t-invest-sdk/generated/operations';
import { AccessLevel, AccountStatus, GetAccountsRequest } from './t-invest-sdk/generated/users';
import { FindInstrumentRequest, GetBondEventsRequest_EventType, InstrumentIdType, InstrumentShort } from './t-invest-sdk/generated/instruments';

//const api = new TinkoffInvestApi({ token: TOKEN });

const api = createSdk(TOKEN);

export interface TInstrument {
  isin: string;
  ticker: string;
  instrumentType: string;
  name: string;
  instrumentKind: number;
  instruments: InstrumentShort[];
}

export async function findTInstrument(ticker: string, type?: string) {
  const req: FindInstrumentRequest = {
    query: ticker,
  };

  const TInstrumentType = type ? type : 'share';

  let TInstruments: TInstrument[] = [];

  const instruments = api.instruments;
  const res = await instruments.findInstrument(req);

  let i = 0;
  res.instruments.forEach((instrument: InstrumentShort) => {
    if (instrument.instrumentType === TInstrumentType && instrument.ticker === ticker) {
      i++;
      let existIndex = TInstruments.findIndex((item) => item.isin === instrument.isin);
      if (existIndex === -1) {
        TInstruments.push({
          isin: instrument.isin,
          ticker: instrument.ticker,
          instrumentType: instrument.instrumentType,
          name: instrument.name,
          instrumentKind: instrument.instrumentKind,
          instruments: [instrument]
        });
      } else {
        //console.log('Instrument: ', instrument);
        TInstruments[existIndex].instruments.push(instrument);
      }
    }
  });

  return TInstruments;
  /*
    .then((res) => {
      let i = 0;

      res.instruments.forEach((instrument: InstrumentShort) => {
        if (instrument.instrumentType === TInstrumentType && instrument.ticker === ticker) {
          i++;
          let existIndex = TInstruments.findIndex((item) => item.isin === instrument.isin);
          if (existIndex === -1) {
            TInstruments.push({
              isin: instrument.isin,
              ticker: instrument.ticker,
              instrumentType: instrument.instrumentType,
              name: instrument.name,
              instrumentKind: instrument.instrumentKind,
              instruments: [instrument]
            });
          } else {
            //console.log('Instrument: ', instrument);
            TInstruments[existIndex].instruments.push(instrument);
          }
        }
      });
      //console.log('Количество инструментов: ', i);
      //console.log('Инструменты: ');
      //console.log(TInstruments[0]);
      return TInstruments;
    });
    */
}

export async function getInfo() {
  // заменить на createSdk
  const users = api.users;
  const _info = await users.getInfo({});

  console.log('info: ', _info);

  return _info; 
}

async function testTInstrument() {
  const res = await findTInstrument('SBER');
  console.log('res: ', res);
}

export async function sdkGetInfo() {
  const users = api.users;
  const userInfo = await users.getInfo({});
  const accounts = await users.getAccounts({});
  const tarrif = await users.getUserTariff({});
  //const marginAttr = await users.getMarginAttributes({ accountId: '1234567890' });

  console.log('Информация о пользователе:', userInfo);
  console.log('Информация о счетах:', accounts);
  console.log('Информация о тарифе пользователя:', tarrif);
  //console.log('Данные маржинальных показателей по счёту', marginAttr);
  return userInfo;
}

export async function sdkGetAccounts() {
  const users = api.users;
  const accounts = await users.getAccounts({});
  return accounts;
}

export async function sdkGetBonds(ttoken: string) {
  try {
    console.log('ttoken: ', ttoken);
    if (ttoken === '') return;
    const api = createSdk(ttoken);
    const instruments = api.instruments;
    const bonds = await instruments.bonds({});
    const res = bonds.instruments;
    return res;
  } catch (error) {
    console.log('Внутренняя ошибка сервера!')
    return [];
  }
}

export async function sdkGetBond(ticker: string, classcode: string, ttoken: string) {
  try {
    console.log('ttoken: ', ttoken);
    if (ttoken === '') return;
    const api = createSdk(ttoken);
    const instruments = api.instruments;
    const options = {idType: InstrumentIdType.INSTRUMENT_ID_TYPE_TICKER, classCode: classcode, id: ticker};
    const bond = await instruments.bondBy(options);
    const res = bond.instrument;
    return res;
  } catch (error) {
    console.log('Внутренняя ошибка сервера!')
    return [];
  }
}

export async function sdkGetEvents(
  from: string, 
  to: string, 
  instrumentId: 
  string, 
  type: 'EVENT_TYPE_UNSPECIFIED' | 'EVENT_TYPE_CPN' | 'EVENT_TYPE_CALL' | 'EVENT_TYPE_MTY' | 'EVENT_TYPE_CONV' | 'UNRECOGNIZED', ttoken: string) {
  try {
    console.log('ttoken: ', ttoken);
    if (ttoken === '') return;
    const api = createSdk(ttoken);
    const instruments = api.instruments;

    const options = {from: new Date(from), to: new Date(to), instrumentId: instrumentId, type: getEventType(type)};
    const result = await instruments.getBondEvents(options);
    const res = result.events;
    return res;
  } catch (error) {
    console.log('Внутренняя ошибка сервера!')
    return [];
  }
}

function getEventType(type: keyof typeof GetBondEventsRequest_EventType) {
  return GetBondEventsRequest_EventType[type];
} 

//testTInstrument();

export async function getAccounts() {
  // заменить на createSdk
  const users = api.users;
  const status = AccountStatus.ACCOUNT_STATUS_ALL;
  const request: GetAccountsRequest = {status: status};
  const options = {};
  const _accounts = await users.getAccounts(request, options);
  return _accounts;
}

export function accessLevel(code: number): string {
  return AccessLevel[code];
}

export function accountStatus(code: number): string {
  return AccountStatus[code];
}

/// для тестов
export async function getPortfolio() {
  const logOn = false;

  const req: FindInstrumentRequest = {
    query: 'SBER',
  };

  const users = api.users;
  const instruments = api.instruments;

  console.log('Пользователи: ', users);

  const _accounts = await users.getAccounts({});
  const _user_tariff = await users.getUserTariff({});
  const _info = await users.getInfo({});

  instruments.getInstrumentBy({idType: InstrumentIdType.INSTRUMENT_ID_TYPE_FIGI, id: 'BBG004730N88'}).then((res) => {
    //console.log('res: ', res);
  });
  
  //console.log('limits: ', _user_tariff.unaryLimits);
  
 
  //console.log('Счета: ', _accounts);
  _accounts.accounts.forEach(async (account) => {
    logOn && console.log('%cСчет: %o', 'color: firebrick; background-color: white', account);
    //console.log('Идентификатор счета: ', account.id);
    
  });

  const { premStatus, qualStatus, qualifiedForWorkWith, tariff } = _info;
  logOn && console.log('Инфо: ');
  logOn && console.log('-------------------------------------------');
  logOn && console.log('Премиум: ', premStatus);
  logOn && console.log('Квалификация: ', qualStatus);
  logOn && console.log('Возможность работы: ', qualifiedForWorkWith);
  logOn && console.log('Тариф: ', tariff);
  
  // получить список счетов
  const { accounts } = await users.getAccounts({});

  logOn && console.log('Счета: ', accounts);

  accounts.forEach(async (account) => {
    logOn && console.log('Счет: ', account);

    // получить портфель по id счета
    const portfolio = await api.operations.getPortfolio({
      accountId: account.id,
      currency: PortfolioRequest_CurrencyRequest.RUB
    });
    logOn && console.log('Идентификатор портфеля: ', portfolio.accountId);
    logOn && console.log('-------------------------------------------');
    logOn && console.log('Портфель: ', portfolio);
    const { 
      totalAmountShares, 
      totalAmountBonds, 
      totalAmountEtf, 
      totalAmountCurrencies, 
      totalAmountFutures
    } = portfolio;
    logOn && console.log('Активы: ');
    logOn && console.log('Всего акций: ', totalAmountShares);
    const shares_currency = totalAmountShares?.currency;
    const shares_units = totalAmountShares?.units;
    const shares_nano = totalAmountShares?.nano;

    logOn && console.log('Всего облигаций: ', totalAmountBonds);
    logOn && console.log('Всего ETF: ', totalAmountEtf);
    logOn && console.log('Всего валюты: ', totalAmountCurrencies);
    logOn && console.log('Всего фьючерсы: ', totalAmountFutures);
    logOn && console.log('%%%\n');
  });

}


///
// Разбор
/*

[dotenv@17.2.1] injecting env (1) from .env -- tip: ⚙️  override existing env vars with { override: true }
[0] Сервер прослушивает порт 8000
[0] Инфо:  {
[0]   premStatus: false,
[0]   qualStatus: false,
[0]   qualifiedForWorkWith: [
[0]     'derivative',
[0]     'foreign_shares',
[0]     'leverage',
[0]     'option',
[0]     'russian_shares'
[0]   ],
[0]   tariff: 'investor'
[0] }
[0] Счета:  [
[0]   {
[0]     id: '2219535762',
[0]     type: 3,
[0]     name: 'Инвесткопилка',
[0]     status: 2,
[0]     openedDate: 2024-12-28T00:00:00.000Z,
[0]     closedDate: 1970-01-01T00:00:00.000Z,
[0]     accessLevel: 2
[0]   },
[0]   {
[0]     id: '2066301389',
[0]     type: 1,
[0]     name: 'Основной',
[0]     status: 2,
[0]     openedDate: 2021-02-12T00:00:00.000Z,
[0]     closedDate: 1970-01-01T00:00:00.000Z,
[0]     accessLevel: 2
[0]   },
[0]   {
[0]     id: '2103437513',
[0]     type: 1,
[0]     name: 'Дубль',
[0]     status: 2,
[0]     openedDate: 2023-11-07T00:00:00.000Z,
[0]     closedDate: 1970-01-01T00:00:00.000Z,
[0]     accessLevel: 2
[0]   },
[0]   {
[0]     id: '2223802307',
[0]     type: 1,
[0]     name: 'Третий',
[0]     status: 2,
[0]     openedDate: 2025-01-16T00:00:00.000Z,
[0]     closedDate: 1970-01-01T00:00:00.000Z,
[0]     accessLevel: 2
[0]   },
[0]   {
[0]     id: '2123037814',
[0]     type: 1,
[0]     name: 'Портфельное инвестирование',
[0]     status: 2,
[0]     openedDate: 2024-01-05T00:00:00.000Z,
[0]     closedDate: 1970-01-01T00:00:00.000Z,
[0]     accessLevel: 2
[0]   }
[0] ]
[0] Счет:  {
[0]   id: '2219535762',
[0]   type: 3,
[0]   name: 'Инвесткопилка',
[0]   status: 2,
[0]   openedDate: 2024-12-28T00:00:00.000Z,
[0]   closedDate: 1970-01-01T00:00:00.000Z,
[0]   accessLevel: 2
[0] }
[0] Счет:  {
[0]   id: '2066301389',
[0]   type: 1,
[0]   name: 'Основной',
[0]   status: 2,
[0]   openedDate: 2021-02-12T00:00:00.000Z,
[0]   closedDate: 1970-01-01T00:00:00.000Z,
[0]   accessLevel: 2
[0] }
[0] Счет:  {
[0]   id: '2103437513',
[0]   type: 1,
[0]   name: 'Дубль',
[0]   status: 2,
[0]   openedDate: 2023-11-07T00:00:00.000Z,
[0]   closedDate: 1970-01-01T00:00:00.000Z,
[0]   accessLevel: 2
[0] }
[0] Счет:  {
[0]   id: '2223802307',
[0]   type: 1,
[0]   name: 'Третий',
[0]   status: 2,
[0]   openedDate: 2025-01-16T00:00:00.000Z,
[0]   closedDate: 1970-01-01T00:00:00.000Z,
[0]   accessLevel: 2
[0] }
[0] Счет:  {
[0]   id: '2123037814',
[0]   type: 1,
[0]   name: 'Портфельное инвестирование',
[0]   status: 2,
[0]   openedDate: 2024-01-05T00:00:00.000Z,
[0]   closedDate: 1970-01-01T00:00:00.000Z,
[0]   accessLevel: 2
[0] }
[0] Идентификатор портфеля:  2123037814
[0] -------------------------------------------
[0] Портфель:  {
[0]   totalAmountShares: { currency: 'rub', units: 0, nano: 0 },
[0]   totalAmountBonds: { currency: 'rub', units: 0, nano: 0 },
[0]   totalAmountEtf: { currency: 'rub', units: 0, nano: 0 },
[0]   totalAmountCurrencies: { currency: 'rub', units: 0, nano: 0 },
[0]   totalAmountFutures: { currency: 'rub', units: 0, nano: 0 },
[0]   expectedYield: { units: 0, nano: 0 },
[0]   positions: [],
[0]   accountId: '2123037814',
[0]   totalAmountOptions: { currency: 'rub', units: 0, nano: 0 },
[0]   totalAmountSp: { currency: 'rub', units: 0, nano: 0 },
[0]   totalAmountPortfolio: { currency: 'rub', units: 0, nano: 0 },
[0]   virtualPositions: [],
[0]   dailyYield: { currency: 'rub', units: 0, nano: 0 },
[0]   dailyYieldRelative: { units: 0, nano: 0 }
[0] }
[0] Идентификатор портфеля:  2103437513
[0] -------------------------------------------
[0] Портфель:  {
[0]   totalAmountShares: { currency: 'rub', units: 5574, nano: 400000000 },
[0]   totalAmountBonds: { currency: 'rub', units: 0, nano: 0 },
[0]   totalAmountEtf: { currency: 'rub', units: 4043, nano: 600000000 },
[0]   totalAmountCurrencies: { currency: 'rub', units: -1419, nano: -510000000 },
[0]   totalAmountFutures: { currency: 'rub', units: 0, nano: 0 },
[0]   expectedYield: { units: -4, nano: -570000000 },
[0]   positions: [
[0]     {
[0]       figi: 'TCS00A108WX3',
[0]       instrumentType: 'etf',
[0]       quantity: [Object],
[0]       averagePositionPrice: [Object],
[0]       expectedYield: [Object],
[0]       currentNkd: undefined,
[0]       averagePositionPricePt: [Object],
[0]       currentPrice: [Object],
[0]       averagePositionPriceFifo: [Object],
[0]       quantityLots: [Object],
[0]       blocked: false,
[0]       blockedLots: [Object],
[0]       positionUid: '41be4f89-9d19-4eac-9ae4-09276f85956a',
[0]       instrumentUid: '1d0e01e5-148c-40e5-bb8f-1bf2d8e03c1a',
[0]       varMargin: [Object],
[0]       expectedYieldFifo: [Object],
[0]       dailyYield: [Object]
[0]     },
[0]     {
[0]       figi: 'TCS10A0JR6A6',
[0]       instrumentType: 'share',
[0]       quantity: [Object],
[0]       averagePositionPrice: [Object],
[0]       expectedYield: [Object],
[0]       currentNkd: undefined,
[0]       averagePositionPricePt: [Object],
[0]       currentPrice: [Object],
[0]       averagePositionPriceFifo: [Object],
[0]       quantityLots: [Object],
[0]       blocked: false,
[0]       blockedLots: [Object],
[0]       positionUid: '6f5c1312-8d3f-479a-abf9-0794d879c832',
[0]       instrumentUid: '45fb6af4-9076-4268-b038-ab7f37d15ab2',
[0]       varMargin: [Object],
[0]       expectedYieldFifo: [Object],
[0]       dailyYield: [Object]
[0]     },
[0]     {
[0]       figi: 'BBG004S68507',
[0]       instrumentType: 'share',
[0]       quantity: [Object],
[0]       averagePositionPrice: [Object],
[0]       expectedYield: [Object],
[0]       currentNkd: undefined,
[0]       averagePositionPricePt: [Object],
[0]       currentPrice: [Object],
[0]       averagePositionPriceFifo: [Object],
[0]       quantityLots: [Object],
[0]       blocked: false,
[0]       blockedLots: [Object],
[0]       positionUid: '3e2d3ee8-e757-418b-8443-306b9a9988a3',
[0]       instrumentUid: '7132b1c9-ee26-4464-b5b5-1046264b61d9',
[0]       varMargin: [Object],
[0]       expectedYieldFifo: [Object],
[0]       dailyYield: [Object]
[0]     },
[0]     {
[0]       figi: 'RUB000UTSTOM',
[0]       instrumentType: 'currency',
[0]       quantity: [Object],
[0]       averagePositionPrice: [Object],
[0]       expectedYield: [Object],
[0]       currentNkd: undefined,
[0]       averagePositionPricePt: [Object],
[0]       currentPrice: [Object],
[0]       averagePositionPriceFifo: [Object],
[0]       quantityLots: [Object],
[0]       blocked: false,
[0]       blockedLots: [Object],
[0]       positionUid: '33e24a92-aab0-409c-88b8-f2d57415b920',
[0]       instrumentUid: 'a92e2e25-a698-45cc-a781-167cf465257c',
[0]       varMargin: [Object],
[0]       expectedYieldFifo: [Object],
[0]       dailyYield: [Object]
[0]     }
[0]   ],
[0]   accountId: '2103437513',
[0]   totalAmountOptions: { currency: 'rub', units: 0, nano: 0 },
[0]   totalAmountSp: { currency: 'rub', units: 0, nano: 0 },
[0]   totalAmountPortfolio: { currency: 'rub', units: 8198, nano: 490000000 },
[0]   virtualPositions: [],
[0]   dailyYield: { currency: 'rub', units: 25, nano: 900000000 },
[0]   dailyYieldRelative: { units: 0, nano: 320000000 }
[0] }
[0] Идентификатор портфеля:  2223802307
[0] -------------------------------------------
[0] Портфель:  {
[0]   totalAmountShares: { currency: 'rub', units: 1495, nano: 200000000 },
[0]   totalAmountBonds: { currency: 'rub', units: 0, nano: 0 },
[0]   totalAmountEtf: { currency: 'rub', units: 0, nano: 0 },
[0]   totalAmountCurrencies: { currency: 'rub', units: -463, nano: -550000000 },
[0]   totalAmountFutures: { currency: 'rub', units: 0, nano: 0 },
[0]   expectedYield: { units: -10, nano: -590000000 },
[0]   positions: [
[0]     {
[0]       figi: 'TCS00A108ZR8',
[0]       instrumentType: 'share',
[0]       quantity: [Object],
[0]       averagePositionPrice: [Object],
[0]       expectedYield: [Object],
[0]       currentNkd: undefined,
[0]       averagePositionPricePt: [Object],
[0]       currentPrice: [Object],
[0]       averagePositionPriceFifo: [Object],
[0]       quantityLots: [Object],
[0]       blocked: false,
[0]       blockedLots: [Object],
[0]       positionUid: '3e69ca99-cffe-4a46-b061-a2f298bcaa3f',
[0]       instrumentUid: '0b9afb23-280f-4fda-a7ad-816994959c6b',
[0]       varMargin: [Object],
[0]       expectedYieldFifo: [Object],
[0]       dailyYield: [Object]
[0]     },
[0]     {
[0]       figi: 'BBG0100R9963',
[0]       instrumentType: 'share',
[0]       quantity: [Object],
[0]       averagePositionPrice: [Object],
[0]       expectedYield: [Object],
[0]       currentNkd: undefined,
[0]       averagePositionPricePt: [Object],
[0]       currentPrice: [Object],
[0]       averagePositionPriceFifo: [Object],
[0]       quantityLots: [Object],
[0]       blocked: false,
[0]       blockedLots: [Object],
[0]       positionUid: '5fe05020-a682-4909-b9f6-93e91413fa93',
[0]       instrumentUid: '7bedd86b-478d-4742-a28c-29d27f8dbc7d',
[0]       varMargin: [Object],
[0]       expectedYieldFifo: [Object],
[0]       dailyYield: [Object]
[0]     },
[0]     {
[0]       figi: 'RUB000UTSTOM',
[0]       instrumentType: 'currency',
[0]       quantity: [Object],
[0]       averagePositionPrice: [Object],
[0]       expectedYield: [Object],
[0]       currentNkd: undefined,
[0]       averagePositionPricePt: [Object],
[0]       currentPrice: [Object],
[0]       averagePositionPriceFifo: [Object],
[0]       quantityLots: [Object],
[0]       blocked: false,
[0]       blockedLots: [Object],
[0]       positionUid: '33e24a92-aab0-409c-88b8-f2d57415b920',
[0]       instrumentUid: 'a92e2e25-a698-45cc-a781-167cf465257c',
[0]       varMargin: [Object],
[0]       expectedYieldFifo: [Object],
[0]       dailyYield: [Object]
[0]     }
[0]   ],
[0]   accountId: '2223802307',
[0]   totalAmountOptions: { currency: 'rub', units: 0, nano: 0 },
[0]   totalAmountSp: { currency: 'rub', units: 0, nano: 0 },
[0]   totalAmountPortfolio: { currency: 'rub', units: 1031, nano: 650000000 },
[0]   virtualPositions: [],
[0]   dailyYield: { currency: 'rub', units: -9, nano: 0 },
[0]   dailyYieldRelative: { units: 0, nano: -860000000 }
[0] }
[0] Идентификатор портфеля:  2219535762
[0] -------------------------------------------
[0] Портфель:  {
[0]   totalAmountShares: { currency: 'rub', units: 0, nano: 0 },
[0]   totalAmountBonds: { currency: 'rub', units: 0, nano: 0 },
[0]   totalAmountEtf: { currency: 'rub', units: 21956, nano: 10000000 },
[0]   totalAmountCurrencies: { currency: 'rub', units: 97, nano: 360000000 },
[0]   totalAmountFutures: { currency: 'rub', units: 0, nano: 0 },
[0]   expectedYield: { units: 5, nano: 600000000 },
[0]   positions: [
[0]     {
[0]       figi: 'RUB000UTSTOM',
[0]       instrumentType: 'currency',
[0]       quantity: [Object],
[0]       averagePositionPrice: [Object],
[0]       expectedYield: [Object],
[0]       currentNkd: undefined,
[0]       averagePositionPricePt: [Object],
[0]       currentPrice: [Object],
[0]       averagePositionPriceFifo: [Object],
[0]       quantityLots: [Object],
[0]       blocked: false,
[0]       blockedLots: [Object],
[0]       positionUid: '33e24a92-aab0-409c-88b8-f2d57415b920',
[0]       instrumentUid: 'a92e2e25-a698-45cc-a781-167cf465257c',
[0]       varMargin: [Object],
[0]       expectedYieldFifo: [Object],
[0]       dailyYield: [Object]
[0]     },
[0]     {
[0]       figi: '',
[0]       instrumentType: '',
[0]       quantity: [Object],
[0]       averagePositionPrice: [Object],
[0]       expectedYield: [Object],
[0]       currentNkd: undefined,
[0]       averagePositionPricePt: [Object],
[0]       currentPrice: [Object],
[0]       averagePositionPriceFifo: [Object],
[0]       quantityLots: undefined,
[0]       blocked: false,
[0]       blockedLots: [Object],
[0]       positionUid: '8f8b8034-ad8b-4181-b4da-109df30386cb',
[0]       instrumentUid: 'f4eb313a-09e2-46d7-8e5a-bda411b8ffc1',
[0]       varMargin: [Object],
[0]       expectedYieldFifo: [Object],
[0]       dailyYield: [Object]
[0]     }
[0]   ],
[0]   accountId: '2219535762',
[0]   totalAmountOptions: { currency: 'rub', units: 0, nano: 0 },
[0]   totalAmountSp: { currency: 'rub', units: 0, nano: 0 },
[0]   totalAmountPortfolio: { currency: 'rub', units: 22053, nano: 370000000 },
[0]   virtualPositions: [],
[0]   dailyYield: { currency: 'rub', units: 10, nano: 460000000 },
[0]   dailyYieldRelative: { units: 0, nano: 50000000 }
[0] }
[0] Идентификатор портфеля:  2066301389
[0] -------------------------------------------
[0] Портфель:  {
[0]   totalAmountShares: { currency: 'rub', units: 16321, nano: 800000000 },
[0]   totalAmountBonds: { currency: 'rub', units: 0, nano: 0 },
[0]   totalAmountEtf: { currency: 'rub', units: 0, nano: 0 },
[0]   totalAmountCurrencies: { currency: 'rub', units: -6226, nano: -910000000 },
[0]   totalAmountFutures: { currency: 'rub', units: 0, nano: 0 },
[0]   expectedYield: { units: -21, nano: -590000000 },
[0]   positions: [
[0]     {
[0]       figi: 'TCS00A0JRH43',
[0]       instrumentType: 'share',
[0]       quantity: [Object],
[0]       averagePositionPrice: [Object],
[0]       expectedYield: [Object],
[0]       currentNkd: undefined,
[0]       averagePositionPricePt: [Object],
[0]       currentPrice: [Object],
[0]       averagePositionPriceFifo: [Object],
[0]       quantityLots: [Object],
[0]       blocked: false,
[0]       blockedLots: [Object],
[0]       positionUid: '52ac22f4-da52-4368-ae65-3bcb2496f4db',
[0]       instrumentUid: '459a1a0a-0253-465a-bd4e-afaaf5e670b0',
[0]       varMargin: [Object],
[0]       expectedYieldFifo: [Object],
[0]       dailyYield: [Object]
[0]     },
[0]     {
[0]       figi: 'TCS10A108K09',
[0]       instrumentType: 'share',
[0]       quantity: [Object],
[0]       averagePositionPrice: [Object],
[0]       expectedYield: [Object],
[0]       currentNkd: undefined,
[0]       averagePositionPricePt: [Object],
[0]       currentPrice: [Object],
[0]       averagePositionPriceFifo: [Object],
[0]       quantityLots: [Object],
[0]       blocked: false,
[0]       blockedLots: [Object],
[0]       positionUid: '0d0f107f-479b-42f2-93fe-5d4a3fc0b166',
[0]       instrumentUid: '538a1b13-df23-4449-8302-e8adbc25daf4',
[0]       varMargin: [Object],
[0]       expectedYieldFifo: [Object],
[0]       dailyYield: [Object]
[0]     },
[0]     {
[0]       figi: 'BBG004730ZJ9',
[0]       instrumentType: 'share',
[0]       quantity: [Object],
[0]       averagePositionPrice: [Object],
[0]       expectedYield: [Object],
[0]       currentNkd: undefined,
[0]       averagePositionPricePt: [Object],
[0]       currentPrice: [Object],
[0]       averagePositionPriceFifo: [Object],
[0]       quantityLots: [Object],
[0]       blocked: false,
[0]       blockedLots: [Object],
[0]       positionUid: '626d2ab0-3359-4d2d-8366-daedd2a0d000',
[0]       instrumentUid: '8e2b0325-0292-4654-8a18-4f63ed3b0e09',
[0]       varMargin: [Object],
[0]       expectedYieldFifo: [Object],
[0]       dailyYield: [Object]
[0]     },
[0]     {
[0]       figi: 'TCS90A0JQUZ6',
[0]       instrumentType: 'share',
[0]       quantity: [Object],
[0]       averagePositionPrice: [Object],
[0]       expectedYield: [Object],
[0]       currentNkd: undefined,
[0]       averagePositionPricePt: [Object],
[0]       currentPrice: [Object],
[0]       averagePositionPriceFifo: [Object],
[0]       quantityLots: [Object],
[0]       blocked: false,
[0]       blockedLots: [Object],
[0]       positionUid: 'adc78cdb-d662-45cd-85d6-f5e605966b9e',
[0]       instrumentUid: '9b9a584e-448f-40da-9ba8-353b44ad697a',
[0]       varMargin: [Object],
[0]       expectedYieldFifo: [Object],
[0]       dailyYield: [Object]
[0]     },
[0]     {
[0]       figi: 'RUB000UTSTOM',
[0]       instrumentType: 'currency',
[0]       quantity: [Object],
[0]       averagePositionPrice: [Object],
[0]       expectedYield: [Object],
[0]       currentNkd: undefined,
[0]       averagePositionPricePt: [Object],
[0]       currentPrice: [Object],
[0]       averagePositionPriceFifo: [Object],
[0]       quantityLots: [Object],
[0]       blocked: false,
[0]       blockedLots: [Object],
[0]       positionUid: '33e24a92-aab0-409c-88b8-f2d57415b920',
[0]       instrumentUid: 'a92e2e25-a698-45cc-a781-167cf465257c',
[0]       varMargin: [Object],
[0]       expectedYieldFifo: [Object],
[0]       dailyYield: [Object]
[0]     },
[0]     {
[0]       figi: 'BBG004730N88',
[0]       instrumentType: 'share',
[0]       quantity: [Object],
[0]       averagePositionPrice: [Object],
[0]       expectedYield: [Object],
[0]       currentNkd: undefined,
[0]       averagePositionPricePt: [Object],
[0]       currentPrice: [Object],
[0]       averagePositionPriceFifo: [Object],
[0]       quantityLots: [Object],
[0]       blocked: false,
[0]       blockedLots: [Object],
[0]       positionUid: '41eb2102-5333-4713-bf15-72b204c4bf7b',
[0]       instrumentUid: 'e6123145-9665-43e0-8413-cd61b8aa9b13',
[0]       varMargin: [Object],
[0]       expectedYieldFifo: [Object],
[0]       dailyYield: [Object]
[0]     }
[0]   ],
[0]   accountId: '2066301389',
[0]   totalAmountOptions: { currency: 'rub', units: 0, nano: 0 },
[0]   totalAmountSp: { currency: 'rub', units: 0, nano: 0 },
[0]   totalAmountPortfolio: { currency: 'rub', units: 10094, nano: 890000000 },
[0]   virtualPositions: [],
[0]   dailyYield: { currency: 'rub', units: -85, nano: -780000000 },
[0]   dailyYieldRelative: { units: 0, nano: -840000000 }
[0] }

*/