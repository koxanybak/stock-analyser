const isString = (val: any): val is string => {
    return typeof val === "string" || val instanceof String;
};

// Parses string, throws an error if fails
export const parseString = (val: any): string => {
    if (!val || !isString(val)) {
        throw Error();
    }

    return val;
};

// Parses a list of strings, throws an error if fails
export const parseListString = (val: any): string[] => {
    if (!val || !(Array.isArray(val) && val.every((el) => isString(el)))) {
        throw Error("Is not a list");
    }

    return val;
};
