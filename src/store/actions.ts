import * as constants from "./constants";
import { IQuery } from "../interfaces/Query";
import * as quandl from "../services/quandl";
import { ThunkAction } from "redux-thunk";
import { IState } from "./reducer";
import { IStockPrice } from "../interfaces/StockPrice";

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
  const queries = input
    .trim()
    .split(" ")
    .map(
      tickerSymbol =>
        ({
          tickerSymbol
        } as IQuery)
    );
  dispatch(updateQueries(queries));
};

interface IUpdateQueries {
  type: constants.UPDATE_QUERIES;
  queries: IQuery[];
}
export const updateQueries = (
  queries: IQuery[]
): ThunkAction<void, IState, {}, Action> => dispatch => {
  dispatch({
    type: constants.UPDATE_QUERIES,
    queries: queries
  } as IUpdateQueries);

  const tickerSymbols = queries.map(query => query.tickerSymbol);
  dispatch(updateStockPrices(tickerSymbols));
};

export interface IUpdateStockPrices {
  type: constants.UPDATE_STOCK_PRICES;
  tickerSymbols: string[];
}
export const updateStockPrices = (
  tickerSymbols: string[]
): ThunkAction<Promise<void>, IState, {}, Action> => async (
  dispatch,
  getState
) => {
  dispatch({
    type: constants.UPDATE_STOCK_PRICES,
    tickerSymbols
  } as IUpdateStockPrices);

  const state = getState();
  tickerSymbols
    .filter(symbol => {
      const stockPrice = state.stockPrices.get(symbol);
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
    tickerSymbol,
  } as IFetchStockPrice);

  const fetchResult = await quandl.fetchStockPrice(tickerSymbol);

  const state = getState();

  // set or skip
  if (state.stockPrices.get(tickerSymbol)) {
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
  | IUpdateQueries
  | IExecuteQuery
  | IUpdateStockPrices
  | IFetchStockPrice
  | ISetStockPrice;
