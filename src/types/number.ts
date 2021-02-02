import { parseString } from "./string";

// Parses the numeral out of the money value, throws an error if fails
export const parseMoney = (val: any): number => {
    const strVal = parseString(val);
    const match = strVal.match(/[-]?\d*[,.]?\d+(([eE][-]?)?\d+)?/);
    if (!match || match.length === 0) {
        throw Error();
    }
    const numStr = match[0].replace(",", ".");

    const num = parseFloat(numStr);
    if (isNaN(num)) {
        throw Error();
    }

    return num;
};

export const isNumber = (val: any): val is number => {
    return typeof val === "number" || val instanceof Number;
};
