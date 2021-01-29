import { NextFunction, Request, Response } from "express";
import { HttpError } from "../types/error";
import { STATUS_CODES } from "http";
import { error } from "../utils/logger";

// Use this in an endpoint to respond with an error.
export const newErr = (status: number, msg: string): HttpError => {
    const err: HttpError = new Error(msg);
    err.status = status;
    return err;
};


export const unknownEndpoint = (_req: Request, _res: Response, next: NextFunction): void => {
    const err: HttpError = new Error("Unknown endpoint");
    err.status = 404;
    next(err);
};


export const errorLogger = (err: HttpError, req: Request, _res: Response, next: NextFunction): void => {
    const status = err.status || 500;

    if (process.env.NODE_ENV !== "test" || status === 500) {
        error(`
            ERROR: ${err.message}
            Request headers: ${JSON.stringify(req.headers)}
            Request params: ${JSON.stringify(req.params)}
        `);
    }
    
    if ((process.env.NODE_ENV === "test" && status === 500) || process.env.NODE_ENV === "development") {
        error(err.stack);
    }

    next(err);
};


export const errorHandler = (err: HttpError, _req: Request, res: Response, _next: NextFunction): void => {
    const status = err.status || 500;
    const httpMessage = STATUS_CODES[status]; // Bad request, Not found etc.

    let message: string | undefined;

    // Messages with status codes 500 could contain sensitive information
    // which should not be sent to the client while in production.
    if (process.env.NODE_ENV === "production" && status === 500) {
        message = httpMessage;
    } else {
        message = `${httpMessage}: ${err.message}`;
    }

    res.status(status).send(message);
};
