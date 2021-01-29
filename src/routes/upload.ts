import { Request, Response, Router } from "express";
import asyncHandler from "express-async-handler";
import fileUpload from "express-fileupload";
import { isFileUpload } from "../types/upload";
import { newErr } from "../utils/error";
import papa from "papaparse";
import { parseStockDataRow } from "../types/stockdata";
import { saveStockData } from "../services/stock";

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
    const stockData = data.map((el, i) => {
        try {
            return parseStockDataRow(el);
        } catch (e) {
            throw newErr(400, `Error at csv row index ${i}: ${e.message}`);
        }
    });

    await saveStockData(stockData);

    res.status(200).end();
}));

export default uploadRouter;
