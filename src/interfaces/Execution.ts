import { IQuery } from "./Query";

export interface IPrice {
  date: Date;
  closePrice: number;
}

export interface IExecution {
  query: IQuery;
  name?: string;
  data?: IPrice[];
}
