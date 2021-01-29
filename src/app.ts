import express from "express";
import uploadRouter from "./routes/upload";
import { errorHandler, errorLogger, unknownEndpoint } from "./utils/error";

const app = express();

// Routes
app.use("/api/upload/", uploadRouter);
app.use("/", unknownEndpoint);

// Middleware
app.use(errorLogger);
app.use(errorHandler);

export default app;
