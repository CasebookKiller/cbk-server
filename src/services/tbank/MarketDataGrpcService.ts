import { createGrpcClient, createMetadata } from '../../utils/grpcHelper';
import type {
  GetCandlesRequest, GetCandlesResponse,
  GetClosePricesRequest, GetClosePricesResponse,
  GetLastPricesRequest, GetLastPricesResponse,
  GetLastTradesRequest, GetLastTradesResponse,
  GetMarketValuesRequest, GetMarketValuesResponse,
  GetOrderBookRequest, GetOrderBookResponse,
  GetTechAnalysisRequest, GetTechAnalysisResponse,
  GetTradingStatusRequest, GetTradingStatusResponse,
  GetTradingStatusesRequest, GetTradingStatusesResponse,
} from '../../generated/marketdataTypes';

const client = createGrpcClient('marketdata.proto', 'MarketDataService');

export const marketDataGrpc = {
  getCandles: (request: GetCandlesRequest, token: string): Promise<GetCandlesResponse> =>
    new Promise((resolve, reject) => {
      client.GetCandles(request, createMetadata(token), (err: any, response: GetCandlesResponse) => {
        if (err) reject(err);
        else resolve(response);
      });
    }),
  
  getClosePrices: (request: GetClosePricesRequest, token: string): Promise<GetClosePricesResponse> =>
    new Promise((resolve, reject) => {
      client.GetClosePrices(request, createMetadata(token), (err: any, response: GetClosePricesResponse) => {
        if (err) reject(err);
        else resolve(response);
      });
    }),

  getLastPrices: (request: GetLastPricesRequest, token: string): Promise<GetLastPricesResponse> =>
    new Promise((resolve, reject) => {
      client.GetLastPrices(request, createMetadata(token), (err: any, response: GetLastPricesResponse) => {
        if (err) reject(err);
        else resolve(response);
      });
    }),

  getLastTrades: (request: GetLastTradesRequest, token: string): Promise<GetLastTradesResponse> =>
    new Promise((resolve, reject) => {
      client.GetLastTrades(request, createMetadata(token), (err: any, response: GetLastTradesResponse) => {
        if (err) reject(err);
        else resolve(response);
      });
    }),

  getMarketValues: (request: GetMarketValuesRequest, token: string): Promise<GetMarketValuesResponse> =>
    new Promise((resolve, reject) => {
      client.GetMarketValues(request, createMetadata(token), (err: any, response: GetMarketValuesResponse) => {
        if (err) reject(err);
        else resolve(response);
      });
    }),

  getOrderBook: (request: GetOrderBookRequest, token: string): Promise<GetOrderBookResponse> =>
    new Promise((resolve, reject) => {
      client.GetOrderBook(request, createMetadata(token), (err: any, response: GetOrderBookResponse) => {
        if (err) reject(err);
        else resolve(response);
      });
    }),

  getTechAnalysis: (request: GetTechAnalysisRequest, token: string): Promise<GetTechAnalysisResponse> =>
    new Promise((resolve, reject) => {
      client.GetTechAnalysis(request, createMetadata(token), (err: any, response: GetTechAnalysisResponse) => {
        if (err) reject(err);
        else resolve(response);
      });
    }),

  getTradingStatus: (request: GetTradingStatusRequest, token: string): Promise<GetTradingStatusResponse> =>
    new Promise((resolve, reject) => {
      client.GetTradingStatus(request, createMetadata(token), (err: any, response: GetTradingStatusResponse) => {
        if (err) reject(err);
        else resolve(response);
      });
    }),

  getTradingStatuses: (request: GetTradingStatusesRequest, token: string): Promise<GetTradingStatusesResponse> =>
    new Promise((resolve, reject) => {
      client.GetTradingStatuses(request, createMetadata(token), (err: any, response: GetTradingStatusesResponse) => {
        if (err) reject(err);
        else resolve(response);
      });
    }),
};