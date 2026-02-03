import express, { Request, Response } from "express";
import cors from "cors";
import routes from "./routes/index";
import logRequestResponse from "./middlewares/logger.middleware";
import compression from "compression";
import { globalErrorHandler, notFoundHandler } from "./lib/errorsHandle";

const app = express();

// Enable CORS for all routes
app.use(
  cors({
    origin: "*",
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// compression the all data
app.use(compression());

// Use the logging middleware for all routes
app.use(logRequestResponse);

// Health check endpoint
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, Job Hub Backend API!");
});

// API routes
app.use("/api/v1", routes);

// Handle 404 - Route not found
app.use(notFoundHandler);

// Global error handler - must be last
app.use(globalErrorHandler);

export default app;
