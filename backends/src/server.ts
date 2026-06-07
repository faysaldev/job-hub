import express, { Request, Response } from "express";
import cors from "cors";
import routes from "./routes/index";
import logRequestResponse from "./middlewares/logger.middleware";
import compression from "compression";
import { globalErrorHandler, notFoundHandler } from "./lib/errorsHandle";

import { FRONTEND_URL } from "./config/ENV";

const app = express();

// Set up allowed origins for CORS
const allowedOrigins = FRONTEND_URL
  ? FRONTEND_URL.split(",").map((url) => url.trim())
  : ["http://localhost:3000", "https://job-hubs.vercel.app"];

// Add production Vercel URL to allowed origins if not already present
if (!allowedOrigins.includes("https://job-hubs.vercel.app")) {
  allowedOrigins.push("https://job-hubs.vercel.app");
}

// Enable CORS for all routes
app.use(
  cors({
    origin: true, // This instructs cors to automatically reflect the request origin
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],
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
