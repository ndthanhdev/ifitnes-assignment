export interface IPrice {
  date: string;
  close: number;
}

export interface IStockPrice {
  tickerSymbol: string;
  // TODO: fetchedAt: Date;
  error?: Error,
  name?: string;
  prices?: IPrice[]
}