import { IEntity } from '../interfaces/Entity'
import { IStockPrice } from '../interfaces/StockPrice'
import { IStockPricesMap } from '../store/reducer'

function createStockPrice(tickerSymbol: string) {
  return {
    tickerSymbol,
  } as IStockPrice
}

export const getStockPricesFromEntities = (entities: IEntity[]) => {
  return entities.reduce(
    (acc, entity) => {
      if (entity.type === 'Combination') {
        entity.queries.forEach(ticker => {
          acc[ticker.tickerSymbol] = createStockPrice(ticker.tickerSymbol)
        })
      } else if (entity.type === 'TickerEntity') {
        acc[entity.tickerSymbol] = createStockPrice(entity.tickerSymbol)
      }
      return acc
    },
    {} as IStockPricesMap
  )
}
