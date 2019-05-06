import { ITickerEntity } from "./Entity";
import { IStockPrice } from "./StockPrice";

export interface IVisualTicker
  extends Pick<ITickerEntity, "tickerSymbol" | "operator" | "base">,
    Pick<IStockPrice, "name" | "error" > {
  isLoading: boolean
  color: string
  prices: any[]
}
