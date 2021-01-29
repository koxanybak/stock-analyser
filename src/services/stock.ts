import { StockDataRow } from "../types/stockdata";

// I know saving stuff in memory is makes the app stateful which it not usable
// when used with e.g. Kubernetes. But I think it's good enough for an MVP.
// When developing further the 'saver' and 'getter' would be interact with
// something stateful like Redis or Postgres.
// The functions are already async so the endpoints don't have to change to await when
// integrating some storage.

let currentStockData: StockDataRow[] | null = null;

export const saveStockData = async (stockData: StockDataRow[]): Promise<void> => {
    currentStockData = stockData;
};

export const getStockData = async (): Promise<StockDataRow[] | null> => {
    return currentStockData;
};



