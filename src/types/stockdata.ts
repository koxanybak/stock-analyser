// All money values are assumed to be dollars, for now.
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
export const dataIndexes = {
    date: 0,
    closeLast: 1,
    volume: 2,
    open: 3,
    high: 4,
    low: 5,
};

// The length the csv row should have
export const numKeysInData = Object.keys(dataIndexes).length;


export const parseStockDataRow = (val: any): StockDataRow => {
    if (!Array.isArray(val)) {
        throw Error("Row is not an array");
    }
    if (val.length !== numKeysInData) {
        throw Error(`Wrong length array. Expected ${numKeysInData}, Got: ${val.length}`);
    }

    const dateNum = Date.parse(val[dataIndexes.date]);
    const closeLast = parseFloat(val[dataIndexes.closeLast]);
    const volume = parseInt(val[dataIndexes.volume]);
    const open = parseFloat(val[dataIndexes.open]);
    const high = parseFloat(val[dataIndexes.high]);
    const low = parseFloat(val[dataIndexes.low]);

    if (isNaN(closeLast)) {
        throw Error(`Malformatted 'close/last'. Got ${val[dataIndexes.closeLast]}`);
    }
    if (isNaN(volume)) {
        throw Error(`Malformatted 'volume'. Got ${val[dataIndexes.volume]}`);
    }
    if (isNaN(open)) {
        throw Error(`Malformatted 'open'. Got ${val[dataIndexes.open]}`);
    }
    if (isNaN(high)) {
        throw Error(`Malformatted 'high'. Got ${val[dataIndexes.high]}`);
    }
    if (isNaN(low)) {
        throw Error(`Malformatted 'low'. Got ${val[dataIndexes.low]}`);
    }
    if (isNaN(dateNum)) {
        throw Error(`Malformatted 'date'. Got ${val[dataIndexes.date]}`);
    }

    const date = new Date(dateNum);

    return {
        date,
        closeLast,
        volume,
        open,
        high,
        low,
    };
};
