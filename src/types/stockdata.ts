import { parseMoney } from "./number";

// All money values are just numerals without a curreny, for now.
// A row currently doesn't allow for empty columns.
// I know some csvs might contain them but I thought that this is good enough for an MVP.
export interface StockDataRow {
    date: Date;
    closeLast: number;
    volume: number;
    open: number;
    high: number;
    low: number;
}

// This makes it clearer to parse the stock data and less error prone if row format changes
const dataIndexes = {
    date: 0,
    closeLast: 1,
    volume: 2,
    open: 3,
    high: 4,
    low: 5,
};

// The length the csv row should have
const numKeysInData = Object.keys(dataIndexes).length;


// Parse a stock data row out of a value. Throws error if fails.
export const parseStockDataRow = (val: any): StockDataRow => {
    if (!Array.isArray(val)) {
        throw Error("Row is not an array");
    }
    if (val.length !== numKeysInData) {
        throw Error(`Wrong length array. Expected ${numKeysInData}, Got: ${val.length}`);
    }

    const stockDataRow: StockDataRow = {
        date: new Date(),
        closeLast: 0,
        volume: 0,
        open: 0,
        high: 0,
        low: 0,
    };

    // Parse field by field
    // Don't allow for NaN values

    const closeLast = val[dataIndexes.closeLast];
    try {
        stockDataRow.closeLast = parseMoney(closeLast);
    } catch (e) {
        throw Error(`Malformatted 'close/last'. Got ${closeLast}`);
    }

    const low = val[dataIndexes.low];
    try {
        stockDataRow.low = parseMoney(low);
    } catch (e) {
        throw Error(`Malformatted 'low'. Got ${low}`);
    }

    const high = val[dataIndexes.high];
    try {
        stockDataRow.high = parseMoney(high);
    } catch (e) {
        throw Error(`Malformatted 'high'. Got ${high}`);
    }

    const open = val[dataIndexes.open];
    try {
        stockDataRow.open = parseMoney(open);
    } catch (e) {
        throw Error(`Malformatted 'open'. Got ${open}`);
    }

    const volume = parseInt(val[dataIndexes.volume]);
    const dateNum = Date.parse(val[dataIndexes.date]);

    if (isNaN(volume)) {
        throw Error(`Malformatted 'volume'. Got ${val[dataIndexes.volume]}`);
    }
    if (isNaN(dateNum)) {
        throw Error(`Malformatted 'date'. Got ${val[dataIndexes.date]}`);
    }

    stockDataRow.volume = volume;
    stockDataRow.date = new Date(dateNum);

    return stockDataRow;
};
