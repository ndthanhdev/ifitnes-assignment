import * as constants from './constants'
import * as quandl from '../services/quandl'
import { ThunkAction } from 'redux-thunk'
import { IState, IStockPricesMap } from './reducer'
import { IStockPrice } from '../interfaces/StockPrice'
import { parse } from '../utils/parser'
import { IEntity } from '../interfaces/Entity'
import { getStockPricesFromEntities } from '../utils/actions'

interface IUpdateInput {
  type: constants.UPDATE_INPUT
  input: string
}
export const updateInput = (
  input: string
): ThunkAction<void, IState, {}, Action> => dispatch => {
  const theInput = input.toUpperCase()

  dispatch({
    type: constants.UPDATE_INPUT,
    input: theInput,
  })

  const parseOutput = parse(theInput)

  if (parseOutput instanceof Array) {
    dispatch(setEntities(parseOutput))
  } else {
    dispatch(setParserMessage(String(parseOutput)))
  }
}

interface ISetParserMessage {
  type: constants.SET_PARSER_MESSAGE
  message: string
}
export const setParserMessage = (message: string) =>
  ({ type: constants.SET_PARSER_MESSAGE, message } as ISetParserMessage)

interface ISetEntities {
  type: constants.SET_ENTITIES
  entities: IEntity[]
}
export const setEntities = (
  entities: IEntity[]
): ThunkAction<void, IState, {}, Action> => dispatch => {
  dispatch({
    type: constants.SET_ENTITIES,
    entities,
  } as ISetEntities)

  dispatch(updateStockPrices(getStockPricesFromEntities(entities)))
}

export interface IUpdateStockPrices {
  type: constants.UPDATE_STOCK_PRICES
  stockPrices: IStockPricesMap
}
export const updateStockPrices = (
  stockPrices: IStockPricesMap
): ThunkAction<Promise<void>, IState, {}, Action> => async (
  dispatch,
  getState
) => {
  dispatch({
    type: constants.UPDATE_STOCK_PRICES,
    stockPrices,
  } as IUpdateStockPrices)

  const state = getState()
  const tickerSymbols = Object.keys(stockPrices)

  tickerSymbols
    .filter(symbol => {
      const stockPrice = state.stockPriceMap[symbol]
      return !stockPrice || !stockPrice.name
    })
    .map(tickerSymbol => dispatch(fetchStockPrice(tickerSymbol)))
}

export interface IFetchStockPrice {
  type: constants.FETCH_STOCK_PRICE
  tickerSymbol: string
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
  } as IFetchStockPrice)

  const fetchResult = await quandl.fetchStockPrice(tickerSymbol)

  const state = getState()

  // set or skip
  if (state.stockPriceMap[tickerSymbol]) {
    dispatch(setStockPrice(fetchResult))
  }
}

export interface ISetStockPrice {
  type: constants.SET_STOCK_PRICE
  stockPrice: IStockPrice
}
export const setStockPrice = (stockPrice: IStockPrice) =>
  ({
    type: constants.SET_STOCK_PRICE,
    stockPrice,
  } as ISetStockPrice)

export type Action =
  | IUpdateInput
  | ISetParserMessage
  | IUpdateStockPrices
  | IFetchStockPrice
  | ISetStockPrice
  | ISetEntities
