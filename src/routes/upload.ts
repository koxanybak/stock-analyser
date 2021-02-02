import { Request, Response, Router } from "express";
import asyncHandler from "express-async-handler";
import fileUpload from "express-fileupload";
import { isFileUpload } from "../types/upload";
import { newErr } from "../utils/error";
import papa from "papaparse";
import { parseStockDataRow, StockDataRow } from "../types/stockdata";
import { saveStockData } from "../services/stock";
import { parseListString } from "../types/string";

const uploadRouter = Router();

uploadRouter.use(fileUpload());

uploadRouter.post("/", asyncHandler(async (req: Request, res: Response) => {
    // Parse csv
    const csv = req.files?.csv;
    if (!isFileUpload(csv)) {
        throw newErr(400, "Malformatted or missing csv file");
    }
    const stringData = csv.data.toString("utf-8");

    const { data, errors } = papa.parse(stringData);
    if (errors.length !== 0) {
        throw newErr(400, `Malformatted or missing csv file: ${errors[0].message}`);
    }
    
    // Parse data into typed list
    const stockDataUndef = data.slice(1).map((el, i) => {
        try {
            // Papa parses empty rows into a list of length one. Discard them.
            const list = parseListString(el); // Parse row into a list of strings to check for length
            if (list.length === 1) {
                return undefined;
            }

            return parseStockDataRow(list);
        } catch (e) {
            // Respond with 400 if a row is malformatted. Could be easily changed to discard the row instead.
            throw newErr(400, `Error at csv row index ${i}: ${e.message}`);
        }
    });
    // Filter out undef
    const stockData = stockDataUndef.filter((val) => val !== undefined) as StockDataRow[];

    await saveStockData(stockData);

    res.status(204).end();
}));

export default uploadRouter;
