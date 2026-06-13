// src/main/services/tbank/InstrumentsGrpcService.ts
import { createGrpcClient, createMetadata } from '../../utils/grpcHelper';
import type {
  InstrumentRequest,
  BondResponse,
  BondsResponse,
  CurrencyResponse,
  CurrenciesResponse,
  EtfResponse,
  EtfsResponse,
  FutureResponse,
  FuturesResponse,
  ShareResponse,
  SharesResponse,
  OptionResponse,
  OptionsResponse,
  StructuredNoteResponse,
  StructuredNotesResponse,
  IndicativesResponse,
  InstrumentResponse,
  FindInstrumentResponse,
  GetAccruedInterestsResponse,
  GetAssetFundamentalsResponse,
  GetAssetReportsResponse,
  GetBondCouponsResponse,
  GetBondEventsResponse,
  GetBrandsResponse,
  GetConsensusForecastsResponse,
  GetCountriesResponse,
  GetDividendsResponse,
  GetFavoriteGroupsResponse,
  GetFavoritesResponse,
  GetForecastResponse,
  GetFuturesMarginResponse,
  GetInsiderDealsResponse,
  RiskRatesResponse,
  TradingSchedulesResponse,
  Brand,
  GetBrandRequest,
  CreateFavoriteGroupRequest,
  CreateFavoriteGroupResponse,
  DeleteFavoriteGroupRequest,
  DeleteFavoriteGroupResponse,
  EditFavoritesRequest,
  EditFavoritesResponse,
  FindInstrumentRequest,
  GetAccruedInterestsRequest,
  GetAssetFundamentalsRequest,
  GetAssetReportsRequest,
  AssetsRequest,
  GetBondCouponsRequest,
  GetBondEventsRequest,
  GetBrandsRequest,
  GetConsensusForecastsRequest,
  GetCountriesRequest,
  GetDividendsRequest,
  GetFavoriteGroupsRequest,
  GetFavoritesRequest,
  GetForecastRequest,
  GetFuturesMarginRequest,
  GetInsiderDealsRequest,
  RiskRatesRequest,
  IndicativesRequest,
  FilterOptionsRequest,
  TradingSchedulesRequest,
} from '../../generated/instrumentsTypes';

const client = createGrpcClient('instruments.proto', 'InstrumentsService');

export const instrumentsGrpc = {
  bondBy: (request: InstrumentRequest, token: string): Promise<BondResponse> =>
    new Promise((resolve, reject) => {
      client.BondBy(request, createMetadata(token), (err: any, response: BondResponse) => {
        if (err) reject(err);
        else resolve(response);
      });
    }),

  bonds: (request: any, token: string): Promise<BondsResponse> =>
    new Promise((resolve, reject) => {
      client.Bonds(request, createMetadata(token), (err: any, response: BondsResponse) => {
        if (err) reject(err);
        else resolve(response);
      });
    }),

  createFavoriteGroup: (request: CreateFavoriteGroupRequest, token: string): Promise<CreateFavoriteGroupResponse> =>
    new Promise((resolve, reject) => {
      client.CreateFavoriteGroup(request, createMetadata(token), (err: any, response: CreateFavoriteGroupResponse) => {
        if (err) reject(err);
        else resolve(response);
      });
    }),

  currencies: (request: any, token: string): Promise<CurrenciesResponse> =>
    new Promise((resolve, reject) => {
      client.Currencies(request, createMetadata(token), (err: any, response: CurrenciesResponse) => {
        if (err) reject(err);
        else resolve(response);
      });
    }),

  currencyBy: (request: InstrumentRequest, token: string): Promise<CurrencyResponse> =>
    new Promise((resolve, reject) => {
      client.CurrencyBy(request, createMetadata(token), (err: any, response: CurrencyResponse) => {
        if (err) reject(err);
        else resolve(response);
      });
    }),

  deleteFavoriteGroup: (request: DeleteFavoriteGroupRequest, token: string): Promise<DeleteFavoriteGroupResponse> =>
    new Promise((resolve, reject) => {
      client.DeleteFavoriteGroup(request, createMetadata(token), (err: any, response: DeleteFavoriteGroupResponse) => {
        if (err) reject(err);
        else resolve(response);
      });
    }),

  editFavorites: (request: EditFavoritesRequest, token: string): Promise<EditFavoritesResponse> =>
    new Promise((resolve, reject) => {
      client.EditFavorites(request, createMetadata(token), (err: any, response: EditFavoritesResponse) => {
        if (err) reject(err);
        else resolve(response);
      });
    }),

  etfBy: (request: InstrumentRequest, token: string): Promise<EtfResponse> =>
    new Promise((resolve, reject) => {
      client.EtfBy(request, createMetadata(token), (err: any, response: EtfResponse) => {
        if (err) reject(err);
        else resolve(response);
      });
    }),

  etfs: (request: any, token: string): Promise<EtfsResponse> =>
    new Promise((resolve, reject) => {
      client.Etfs(request, createMetadata(token), (err: any, response: EtfsResponse) => {
        if (err) reject(err);
        else resolve(response);
      });
    }),

  findInstrument: (request: FindInstrumentRequest, token: string): Promise<FindInstrumentResponse> =>
    new Promise((resolve, reject) => {
      client.FindInstrument(request, createMetadata(token), (err: any, response: FindInstrumentResponse) => {
        if (err) reject(err);
        else resolve(response);
      });
    }),

  futureBy: (request: InstrumentRequest, token: string): Promise<FutureResponse> =>
    new Promise((resolve, reject) => {
      client.FutureBy(request, createMetadata(token), (err: any, response: FutureResponse) => {
        if (err) reject(err);
        else resolve(response);
      });
    }),

  futures: (request: any, token: string): Promise<FuturesResponse> =>
    new Promise((resolve, reject) => {
      client.Futures(request, createMetadata(token), (err: any, response: FuturesResponse) => {
        if (err) reject(err);
        else resolve(response);
      });
    }),

  getAccruedInterests: (request: GetAccruedInterestsRequest, token: string): Promise<GetAccruedInterestsResponse> =>
    new Promise((resolve, reject) => {
      client.GetAccruedInterests(request, createMetadata(token), (err: any, response: GetAccruedInterestsResponse) => {
        if (err) reject(err);
        else resolve(response);
      });
    }),

  getAssetBy: (request: any, token: string): Promise<any> =>
    new Promise((resolve, reject) => {
      client.GetAssetBy(request, createMetadata(token), (err: any, response: any) => {
        if (err) reject(err);
        else resolve(response);
      });
    }),

  getAssetFundamentals: (request: GetAssetFundamentalsRequest, token: string): Promise<GetAssetFundamentalsResponse> =>
    new Promise((resolve, reject) => {
      client.GetAssetFundamentals(request, createMetadata(token), (err: any, response: GetAssetFundamentalsResponse) => {
        if (err) reject(err);
        else resolve(response);
      });
    }),

  getAssetReports: (request: GetAssetReportsRequest, token: string): Promise<GetAssetReportsResponse> =>
    new Promise((resolve, reject) => {
      client.GetAssetReports(request, createMetadata(token), (err: any, response: GetAssetReportsResponse) => {
        if (err) reject(err);
        else resolve(response);
      });
    }),

  getAssets: (request: AssetsRequest, token: string): Promise<any> =>
    new Promise((resolve, reject) => {
      client.GetAssets(request, createMetadata(token), (err: any, response: any) => {
        if (err) reject(err);
        else resolve(response);
      });
    }),

  getBondCoupons: (request: GetBondCouponsRequest, token: string): Promise<GetBondCouponsResponse> =>
    new Promise((resolve, reject) => {
      client.GetBondCoupons(request, createMetadata(token), (err: any, response: GetBondCouponsResponse) => {
        if (err) reject(err);
        else resolve(response);
      });
    }),

  getBondEvents: (request: GetBondEventsRequest, token: string): Promise<GetBondEventsResponse> =>
    new Promise((resolve, reject) => {
      client.GetBondEvents(request, createMetadata(token), (err: any, response: GetBondEventsResponse) => {
        if (err) reject(err);
        else resolve(response);
      });
    }),

  getBrandBy: (request: GetBrandRequest, token: string): Promise<Brand> =>
    new Promise((resolve, reject) => {
      client.GetBrandBy(request, createMetadata(token), (err: any, response: Brand) => {
        if (err) reject(err);
        else resolve(response);
      });
    }),

  getBrands: (request: GetBrandsRequest, token: string): Promise<GetBrandsResponse> =>
    new Promise((resolve, reject) => {
      client.GetBrands(request, createMetadata(token), (err: any, response: GetBrandsResponse) => {
        if (err) reject(err);
        else resolve(response);
      });
    }),

  getConsensusForecasts: (request: GetConsensusForecastsRequest, token: string): Promise<GetConsensusForecastsResponse> =>
    new Promise((resolve, reject) => {
      client.GetConsensusForecasts(request, createMetadata(token), (err: any, response: GetConsensusForecastsResponse) => {
        if (err) reject(err);
        else resolve(response);
      });
    }),

  getCountries: (request: GetCountriesRequest, token: string): Promise<GetCountriesResponse> =>
    new Promise((resolve, reject) => {
      client.GetCountries(request, createMetadata(token), (err: any, response: GetCountriesResponse) => {
        if (err) reject(err);
        else resolve(response);
      });
    }),

  getDividends: (request: GetDividendsRequest, token: string): Promise<GetDividendsResponse> =>
    new Promise((resolve, reject) => {
      client.GetDividends(request, createMetadata(token), (err: any, response: GetDividendsResponse) => {
        if (err) reject(err);
        else resolve(response);
      });
    }),

  getFavoriteGroups: (request: GetFavoriteGroupsRequest, token: string): Promise<GetFavoriteGroupsResponse> =>
    new Promise((resolve, reject) => {
      client.GetFavoriteGroups(request, createMetadata(token), (err: any, response: GetFavoriteGroupsResponse) => {
        if (err) reject(err);
        else resolve(response);
      });
    }),

  getFavorites: (request: GetFavoritesRequest, token: string): Promise<GetFavoritesResponse> =>
    new Promise((resolve, reject) => {
      client.GetFavorites(request, createMetadata(token), (err: any, response: GetFavoritesResponse) => {
        if (err) reject(err);
        else resolve(response);
      });
    }),

  getForecastBy: (request: GetForecastRequest, token: string): Promise<GetForecastResponse> =>
    new Promise((resolve, reject) => {
      client.GetForecastBy(request, createMetadata(token), (err: any, response: GetForecastResponse) => {
        if (err) reject(err);
        else resolve(response);
      });
    }),

  getFuturesMargin: (request: GetFuturesMarginRequest, token: string): Promise<GetFuturesMarginResponse> =>
    new Promise((resolve, reject) => {
      client.GetFuturesMargin(request, createMetadata(token), (err: any, response: GetFuturesMarginResponse) => {
        if (err) reject(err);
        else resolve(response);
      });
    }),

  getInsiderDeals: (request: GetInsiderDealsRequest, token: string): Promise<GetInsiderDealsResponse> =>
    new Promise((resolve, reject) => {
      client.GetInsiderDeals(request, createMetadata(token), (err: any, response: GetInsiderDealsResponse) => {
        if (err) reject(err);
        else resolve(response);
      });
    }),

  getInstrumentBy: (request: InstrumentRequest, token: string): Promise<InstrumentResponse> =>
    new Promise((resolve, reject) => {
      client.GetInstrumentBy(request, createMetadata(token), (err: any, response: InstrumentResponse) => {
        if (err) reject(err);
        else resolve(response);
      });
    }),

  getRiskRates: (request: RiskRatesRequest, token: string): Promise<RiskRatesResponse> =>
    new Promise((resolve, reject) => {
      client.GetRiskRates(request, createMetadata(token), (err: any, response: RiskRatesResponse) => {
        if (err) reject(err);
        else resolve(response);
      });
    }),

  indicatives: (request: IndicativesRequest, token: string): Promise<IndicativesResponse> =>
    new Promise((resolve, reject) => {
      client.Indicatives(request, createMetadata(token), (err: any, response: IndicativesResponse) => {
        if (err) reject(err);
        else resolve(response);
      });
    }),

  optionBy: (request: InstrumentRequest, token: string): Promise<OptionResponse> =>
    new Promise((resolve, reject) => {
      client.OptionBy(request, createMetadata(token), (err: any, response: OptionResponse) => {
        if (err) reject(err);
        else resolve(response);
      });
    }),

  options: (request: any, token: string): Promise<OptionsResponse> =>
    new Promise((resolve, reject) => {
      client.Options(request, createMetadata(token), (err: any, response: OptionsResponse) => {
        if (err) reject(err);
        else resolve(response);
      });
    }),

  optionsBy: (request: FilterOptionsRequest, token: string): Promise<OptionsResponse> =>
    new Promise((resolve, reject) => {
      client.OptionsBy(request, createMetadata(token), (err: any, response: OptionsResponse) => {
        if (err) reject(err);
        else resolve(response);
      });
    }),

  shareBy: (request: InstrumentRequest, token: string): Promise<ShareResponse> =>
    new Promise((resolve, reject) => {
      client.ShareBy(request, createMetadata(token), (err: any, response: ShareResponse) => {
        if (err) reject(err);
        else resolve(response);
      });
    }),

  shares: (request: any, token: string): Promise<SharesResponse> =>
    new Promise((resolve, reject) => {
      client.Shares(request, createMetadata(token), (err: any, response: SharesResponse) => {
        if (err) reject(err);
        else resolve(response);
      });
    }),

  structuredNoteBy: (request: InstrumentRequest, token: string): Promise<StructuredNoteResponse> =>
    new Promise((resolve, reject) => {
      client.StructuredNoteBy(request, createMetadata(token), (err: any, response: StructuredNoteResponse) => {
        if (err) reject(err);
        else resolve(response);
      });
    }),

  structuredNotes: (request: any, token: string): Promise<StructuredNotesResponse> =>
    new Promise((resolve, reject) => {
      client.StructuredNotes(request, createMetadata(token), (err: any, response: StructuredNotesResponse) => {
        if (err) reject(err);
        else resolve(response);
      });
    }),

  tradingSchedules: (request: TradingSchedulesRequest, token: string): Promise<TradingSchedulesResponse> =>
    new Promise((resolve, reject) => {
      client.TradingSchedules(request, createMetadata(token), (err: any, response: TradingSchedulesResponse) => {
        if (err) reject(err);
        else resolve(response);
      });
    }),
};