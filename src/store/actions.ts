import * as constants from "./constants";
import { IQuery } from "../interfaces/Query";
import * as quandl from "../services/quandl";
import { ThunkAction } from "redux-thunk";
import { IState, IStockPriceMap } from "./reducer";
import { IStockPrice } from "../interfaces/StockPrice";
import { parse } from "../utils/parser";
import { IEntity } from "../interfaces/Entity";
import { entitiesToQueries, entitiesToStockPrices } from "../utils/actions";

interface IUpdateQuery {
  type: constants.UPDATE_INPUT;
  input: string;
}
export const updateInput = (
  input: string
): ThunkAction<void, IState, {}, Action> => dispatch => {
  dispatch({
    type: constants.UPDATE_INPUT,
    input
  });

  const parseOutput = parse(input);

  if (parseOutput instanceof Array) {
    dispatch(setEntities(parseOutput));
  } else {
    // TODO: handle parse error
  }
};

interface ISetEntities {
  type: constants.SET_ENTITIES;
  entities: IEntity[];
}
export const setEntities = (
  entities: IEntity[]
): ThunkAction<void, IState, {}, Action> => dispatch => {
  dispatch({
    type: constants.SET_ENTITIES,
    entities
  } as ISetEntities);

  dispatch(updateStockPrices(entitiesToStockPrices(entities)));
};

// interface IUpdateQueries {
//   type: constants.UPDATE_QUERIES;
//   queries: Set<string>;
// }
// export const updateQueries = (
//   queries: Set<string>
// ): ThunkAction<void, IState, {}, Action> => dispatch => {
//   dispatch({
//     type: constants.UPDATE_QUERIES,
//     queries: queries
//   } as IUpdateQueries);

//   dispatch(updateStockPrices(Array.from(queries)));

// };

export interface IUpdateStockPrices {
  type: constants.UPDATE_STOCK_PRICES;
  stockPrices:IStockPriceMap;
}
export const updateStockPrices = (
  stockPrices: IStockPriceMap
): ThunkAction<Promise<void>, IState, {}, Action> => async (
  dispatch,
  getState
) => {
  dispatch({
    type: constants.UPDATE_STOCK_PRICES,
    stockPrices
  } as IUpdateStockPrices);

  const state = getState();
  const tickerSymbols = Object.keys(stockPrices);

  tickerSymbols
    .filter(symbol => {
      const stockPrice = state.stockPriceMap[symbol];
      return !stockPrice || !stockPrice.name;
    })
    .map(tickerSymbol => dispatch(fetchStockPrice(tickerSymbol)));
};

export interface IFetchStockPrice {
  type: constants.FETCH_STOCK_PRICE;
  tickerSymbol: string;
}
export const fetchStockPrice = (
  tickerSymbol: string
): ThunkAction<Promise<void>, IState, {}, Action> => async (
  dispatch,
  getState
) => {
  dispatch({
    type: constants.FETCH_STOCK_PRICE,
    tickerSymbol
  } as IFetchStockPrice);

  const fetchResult = await quandl.fetchStockPrice(tickerSymbol);

  const state = getState();

  // set or skip
  if (state.stockPriceMap[tickerSymbol]) {
    dispatch(setStockPrice(fetchResult));
  }
};

export interface ISetStockPrice {
  type: constants.SET_STOCK_PRICE;
  stockPrice: IStockPrice;
}
export const setStockPrice = (stockPrice: IStockPrice) =>
  ({
    type: constants.SET_STOCK_PRICE,
    stockPrice
  } as ISetStockPrice);

export interface IExecuteQuery {
  type: constants.EXECUTE_QUERY;
  query: IQuery;
}
// export const executeQuery = (
//   query: IQuery
// ): ThunkAction<Promise<void>, IState, {}, Action> => async (
//   dispatch: Dispatch<Action>
// ) => {
//   dispatch(<IExecuteQuery>{
//     type: constants.EXECUTE_QUERY,
//     query
//   });
//   try {
//     const fetchResult = await quandl.fetchStockPrice(query.tickerSymbol);
//     const execution = createExecution(fetchResult, query);
//   } catch (error) {
//     // TODO
//   }
// };

export type Action =
  | IUpdateQuery
  | IExecuteQuery
  | IUpdateStockPrices
  | IFetchStockPrice
  | ISetStockPrice
  | ISetEntities;
