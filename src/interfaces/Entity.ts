export type IEntity = ICombination | ITickerEntity

export interface ICombination {
  type: 'Combination'
  queries: ITickerEntity[]
}

export interface ITickerEntity {
  type: 'TickerEntity'
  tickerSymbol: string
  operator: '>' | '<'
  base?: number
}
