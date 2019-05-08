import { Action } from "./actions";
import * as constants from "./constants";
import { IStockPrice } from "../interfaces/StockPrice";
import { IEntity } from "../interfaces/Entity";

export interface IStockPriceMap {
  [tickerSymbol: string]: IStockPrice;
}

export interface IState {
  input: string;
  entities: IEntity[];
  stockPriceMap: IStockPriceMap;
}

export const initialState: IState = {
  input: "",
  entities: [],
  stockPriceMap: {}
};

function updateStockPrices(
  newStockPriceMap: IStockPriceMap,
  currentStockPriceMap: IStockPriceMap
) {
  const theMap = { ...newStockPriceMap };
  const tickerSymbols = Array.from(Object.keys(theMap));

  for (const tickerSymbol of tickerSymbols) {
    theMap[tickerSymbol] = Object.assign(
      { ...theMap[tickerSymbol] },
      currentStockPriceMap[tickerSymbol]
    );
  }

  return theMap;
}

function setStockPrices(
  stockPrice: IStockPrice,
  stockPriceMap: IStockPriceMap
) {
  const theMap = { ...stockPriceMap };
  theMap[stockPrice.tickerSymbol] = {
    ...stockPrice
  };

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
    case constants.SET_ENTITIES:
      return {
        ...state,
        entities: [...action.entities]
      };
    case constants.UPDATE_STOCK_PRICES:
      return {
        ...state,
        stockPriceMap: updateStockPrices(
          action.stockPrices,
          state.stockPriceMap
        )
      };
    case constants.SET_STOCK_PRICE:
      return {
        ...state,
        stockPriceMap: setStockPrices(action.stockPrice, state.stockPriceMap)
      };
    default:
      return { ...state };
  }
};
