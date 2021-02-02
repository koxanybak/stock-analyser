import express from "express";
import stockInfoRouter from "./routes/stockInfo";
import uploadRouter from "./routes/upload";
import { errorHandler, errorLogger, unknownEndpoint } from "./utils/error";

const app = express();

// Routes
app.use("/api/upload/", uploadRouter);
app.use("/api/info/", stockInfoRouter);
app.use("/", unknownEndpoint);

// Middleware
app.use(errorLogger);
app.use(errorHandler);

export default app;
