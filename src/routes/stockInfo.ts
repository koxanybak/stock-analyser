import { NextFunction, Request, Response, Router } from "express";
import asyncHandler from "express-async-handler";
import { getLongestBullTrend, getOpenPriceComparedToSMA5, getVolumeAndPriceChange } from "../helper/stock";
import { parseDate } from "../types/date";
import { newErr } from "../utils/error";

interface StockInfoRequest extends Request {
    start?: Date;
    end?: Date;
}

const stockInfoRouter = Router();

// Middleware to parse query parameters. Responds with error if fails.
stockInfoRouter.use(asyncHandler(async (req: StockInfoRequest, _res: Response, next: NextFunction) => {
    const startFromReq = req.query.start;
    const endFromReq = req.query.end;
    let start = new Date();
    let end = new Date();

    try {
        start = parseDate(startFromReq);
    } catch (e) {
        throw newErr(400, `Missing or malformatted 'start'. Expected a date value, Got: ${startFromReq}`);
    }
    try {
        end = parseDate(endFromReq);
    } catch (e) {
        throw newErr(400, `Missing or malformatted 'end'. Expected a date value, Got: ${endFromReq}`);
    }

    if (start.getTime() > end.getTime()) {
        throw newErr(400, "'end' should be larger than 'start'");
    }

    req.start = start;
    req.end = end;
    next();
}));


// Main endpoint
stockInfoRouter.get("/", asyncHandler(async (req: StockInfoRequest, res: Response) => {
    const start = req.start as Date;
    const end = req.end as Date;
    const errMsg = "No stock data found. Upload some data before querying info about it.";


    const longestBullTrend = getLongestBullTrend(start, end);
    if (!longestBullTrend) {
        throw newErr(400, errMsg);
    }
    const volumeAndPriceChange = getVolumeAndPriceChange(start, end);
    if (!volumeAndPriceChange) {
        throw newErr(400, errMsg);
    }
    const openToSMA5 = getOpenPriceComparedToSMA5(start, end);
    if (!openToSMA5) {
        throw newErr(400, errMsg);
    }


    res.status(200).json({
        longestBullTrend,
        volumeAndPriceChange,
        openToSMA5,
    });
}));


export default stockInfoRouter;
