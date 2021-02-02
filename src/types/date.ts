import { parseString } from "./string";

export const isDate = (val: any): val is Date => {
    return !!val && (val as Date).getTime !== undefined;
};

// Parses a date, throws an error if fails
export const parseDate = (val: any): Date => {
    const strVal = parseString(val);
    const dateVal = Date.parse(strVal);
    if (isNaN(dateVal)) {
        throw Error("Couldn't parse a date");
    }

    return new Date(dateVal);
};
