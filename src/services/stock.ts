import { StockDataRow } from "../types/stockdata";

// I know saving stuff in memory is makes the app stateful which it not usable
// when used with e.g. Kubernetes. But I think it's good enough for an MVP.
// When developing further the 'savers' and 'getters' would be interact with
// something stateful like Redis or Postgres.

let currentStockData: StockDataRow[] | null | undefined;

// Saves the stock data
export const saveStockData = (stockData: StockDataRow[]): void => {
    currentStockData = stockData;
};


// Query options
type CompareOption = "date"
type OrderOptions = {
    by: CompareOption | ((a: StockDataRow, b: StockDataRow) => number);
    desc?: boolean;
}
interface QueryOptions {
    start?: Date;
    end?: Date;
    order?: OrderOptions;
}


// Query stock data
export const getStockData = (opt?: QueryOptions): StockDataRow[] | null | undefined => {
    let stockData = currentStockData;

    if (opt) {
        // Filter
        const end = opt.end;
        const start = opt.start;
        if (end) {
            stockData = stockData?.filter((row) => row.date.getTime() <= end.getTime());
        }
        if (start) {
            stockData = stockData?.filter((row) => row.date.getTime() >= start.getTime());
        }

        // Order/Sort
        const order = opt.order;
        if (order) {
            const { by, desc } = order;
            if (by instanceof Function) {
                stockData = stockData?.sort(by);
            } else {
                const p = desc ? -1 : 1; // Multiply the difference in sorting comparison by this
                switch (by) {
    
                case "date":
                    stockData = stockData?.sort((a, b) => {
                        return p * (a.date.getTime() - b.date.getTime());
                    });
                    break;
                }
            }
        }
    }

    return stockData;
};
