import { Action } from "./actions";
import * as constants from "./constants";
import { IQuery } from "../interfaces/Query";
import { IStockPrice } from "../interfaces/StockPrice";
import { IEntity } from "../interfaces/Entity";

export interface IState {
  input: string;
  entities: IEntity[];
  queries: IQuery[];
  stockPrices: Map<string, IStockPrice>;
}

export const initialState: IState = {
  input: "",
  entities: [],
  queries: [],
  stockPrices: new Map<string, IStockPrice>()
};

function updateStockPrices(
  stockPrices: Map<string, IStockPrice>,
  tickerSymbols: string[]
) {
  const theMap = new Map<string, IStockPrice>();

  for (const tickerSymbol of tickerSymbols) {
    theMap.set(
      tickerSymbol,
      Object.assign({ tickerSymbol }, stockPrices.get(tickerSymbol))
    );
  }

  return theMap;
}

function setStockPrices(
  stockPrices: Map<string, IStockPrice>,
  stockPrice: IStockPrice
) {
  const theMap = new Map<string, IStockPrice>(stockPrices);
  theMap.set(stockPrice.tickerSymbol, {
    ...theMap.get(stockPrice.tickerSymbol),
    ...stockPrice
  });

  return theMap;
}

export const reducer = (
  state: IState = initialState,
  action: Action
): IState => {
  switch (action.type) {
    case constants.UPDATE_INPUT:
      return {
        ...state,
        input: action.input
      };
    case constants.UPDATE_QUERIES:
      return {
        ...state,
        queries: action.queries
      };
    case constants.UPDATE_STOCK_PRICES:
      return {
        ...state,
        stockPrices: updateStockPrices(state.stockPrices, action.tickerSymbols)
      };
    case constants.SET_STOCK_PRICE:
      return {
        ...state,
        stockPrices: setStockPrices(state.stockPrices, action.stockPrice)
      };
    default:
      return state;
  }
};
