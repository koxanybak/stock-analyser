import { getStockData } from "../services/stock";
import { StockDataRow } from "../types/stockdata";


// Business logic to answer Scrooge's questions. All return null if no data can be found.


// Gets the longest period the where closing price of day N is higher than day N-1
export const getLongestBullTrend = (start: Date, end: Date): number | null => {
    // Get data ordered by date
    const stockData = getStockData({ start, end, order: { by: "date" } });
    if (!stockData) {
        return null;
    }
    const len = stockData.length;

    let longestBullTrend = 1;
    let streak = 1;
    stockData.forEach((row, i) => {
        if (i === len - 1) {
            return;
        }
        if (stockData[i+1].closeLast > row.closeLast) {
            streak++;
        } else {
            streak = 1;
        }
        if (streak > longestBullTrend) {
            longestBullTrend = streak;
        }
    });

    return longestBullTrend;
};

// Specify the returned date format
const dateFormatOpts: Intl.DateTimeFormatOptions = { year: "2-digit", month: "2-digit", day: "2-digit" };
const dateLocale = "us-US";


export const getVolumeAndPriceChange = (start: Date, end: Date): {
    date: string;
    volume: number;
    priceChange: number;
}[] | null => {
    // Get filtered and ordered data
    const comparisonFunc = (a: StockDataRow, b: StockDataRow) => {
        const volDiff = b.volume - a.volume;
        if (volDiff === 0) {
            return (b.high - b.low) - (a.high - a.low);
        }
        return volDiff;
    };
    const stockData = getStockData({ start, end, order: { by: comparisonFunc } });
    if (!stockData) {
        return null;
    }

    // Format
    return stockData.map((row) => ({
        date: row.date.toLocaleDateString(dateLocale, dateFormatOpts),
        volume: row.volume,
        priceChange: row.high - row.low,
    }));
};


export const getOpenPriceComparedToSMA5 = (start: Date, end: Date): {
    date: string;
    priceChangePercentage: number;
}[] | null => {
    // Get data ordered by date
    const stockData = getStockData({ order: { by: "date" } });
    if (!stockData) {
        return null;
    }
    const startIndex = stockData.findIndex((row) => row.date >= start);

    const resultList = []; // Will stay empty if startIndex is -1 (i.e. start date bigger than all the dates in the csv)

    // Fill the result list
    for (let i = startIndex; stockData[i] && stockData[i].date <= end; i++) {
        // Check if there is 5 days before, otherwise take all the days before
        const listSMA5 = i - 5 >= 0 ? stockData.slice(i - 5, i) : stockData.slice(0, i);
        // Calc SMA 5
        const sma5 = listSMA5.reduce((a, b) => a + b.closeLast, 0) / listSMA5.length;

        const row = stockData[i];
        const priceChangePercentage = (row.open / sma5 - 1) * 100;
        resultList.push({
            date: row.date.toLocaleDateString(dateLocale, dateFormatOpts),
            priceChangePercentage: priceChangePercentage || 0, // Account for SMA5 being null (it happens when there are no dates before this one)
        });
    }

    // Return sorted by price change percentage
    return resultList.sort((a, b) => (
        b.priceChangePercentage - a.priceChangePercentage
    ));
};
