import { IEntity } from "../interfaces/Entity";
import { IStockPrice } from "../interfaces/StockPrice";
import { IStockPriceMap } from "../store/reducer";

export const entitiesToQueries = (entities: IEntity[]) =>
  entities.reduce((acc, entity) => {
    if (entity.type === "Combination") {
      entity.queries.forEach(ticker => {
        acc.add(ticker.tickerSymbol);
      });
    } else if (entity.type === "TickerEntity") {
      acc.add(entity.tickerSymbol);
    }
    return acc;
  }, new Set<string>());

function createStockPrice(tickerSymbol: string) {
  return {
    tickerSymbol
  } as IStockPrice;
}

export const entitiesToStockPrices = (entities: IEntity[]) => {
  return entities.reduce(
    (acc, entity) => {
      if (entity.type === "Combination") {
        entity.queries.forEach(ticker => {
          acc[ticker.tickerSymbol] = createStockPrice(ticker.tickerSymbol);
        });
      } else if (entity.type === "TickerEntity") {
        acc[entity.tickerSymbol] = createStockPrice(entity.tickerSymbol);
      }
      return acc;
    },
    {} as IStockPriceMap
  );
};

export function tickerSymbolToStockPrice(tickerSymbol: string) {}
