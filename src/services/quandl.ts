import axios from 'axios'
import { IStockPrice, IPrice } from '../interfaces/StockPrice'

const baseUrl = 'https://www.quandl.com/api/v3/datasets/WIKI/'
const apiKey = 'api_key=L3cH3jADdPYnQsZTz3Rx'
export class TickerSymbolNotFound extends Error {
  constructor(tickerSymbol: string) {
    super(`Ticker symbol ${tickerSymbol} not found`)
  }
}

export class CanNotGetResponse extends Error {
  constructor() {
    super('Cannot get response from server')
  }
}

export class UnKnowError extends Error {
  constructor() {
    super('UnKnow Error occurs while fetching stock price')
  }
}

const DATE_INDEX = 0
const CLOSE_PRICE_INDEX = 4
function createPrice(row: any) {
  const theRow = row as Array<any>
  return {
    date: theRow[DATE_INDEX],
    close: parseFloat(theRow[CLOSE_PRICE_INDEX]),
  } as IPrice
}

const INCORRECT_CODE = 'QECx02'

export const fetchStockPrice = async (
  tickerSymbol: string
): Promise<IStockPrice> => {
  try {
    const { data } = await axios.get(
      `${baseUrl}/${tickerSymbol}.json?${apiKey}`
    )
    if (data.quandl_error && data.quandl_error.code === INCORRECT_CODE) {
      return {
        tickerSymbol: tickerSymbol,
        error: new TickerSymbolNotFound(tickerSymbol),
      }
    } else {
      return {
        tickerSymbol: tickerSymbol,
        name: '' + data.dataset.name,
        prices: data.dataset.data.map((row: any) => createPrice(row)),
      }
    }
  } catch (error) {
    if (error.message === 'Network Error') {
      return {
        tickerSymbol: tickerSymbol,
        error: new CanNotGetResponse(),
      }
    } else if (error.response && error.response.status === 404) {
      return {
        tickerSymbol: tickerSymbol,
        error: new TickerSymbolNotFound(tickerSymbol),
      }
    } else {
      return {
        tickerSymbol: tickerSymbol,
        error: new UnKnowError(),
      }
    }
  }
}
