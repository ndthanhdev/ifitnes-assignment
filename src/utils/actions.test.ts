import { getStockPricesFromEntities } from './actions'
import { IStockPricesMap } from '../store/reducer'

test('Empty array', () => {
  const actual = getStockPricesFromEntities([])

  expect(actual).toEqual({})
})

test('a TickerQuery', () => {
  const actual = getStockPricesFromEntities([
    { type: 'TickerEntity', tickerSymbol: 'aSymbol', operator: '>' },
  ])

  expect(actual).toEqual({
    aSymbol: {
      tickerSymbol: 'aSymbol',
    },
  } as IStockPricesMap)
})

test('a Combination', () => {
  const actual = getStockPricesFromEntities([
    {
      type: 'Combination',
      queries: [
        { type: 'TickerEntity', tickerSymbol: 'aSymbol', operator: '>' },
      ],
    },
  ])

  expect(actual).toEqual({
    aSymbol: {
      tickerSymbol: 'aSymbol',
    },
  } as IStockPricesMap)
})
