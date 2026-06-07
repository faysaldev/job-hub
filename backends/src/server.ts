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
// app.use(
//   cors({
//     origin: (origin, callback) => {
//       // Allow requests with no origin (like mobile apps, curl, postman)
//       if (!origin) return callback(null, true);

//       if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes("*")) {
//         callback(null, true);
//       } else {
//         callback(null, false);
//       }
//     },
//     credentials: true,
//     optionsSuccessStatus: 200,
//   })
// );

app.use(
  cors({
    origin: "*", // allow only this origin to access the API
    methods: ["GET", "POST", "PUT", "DELETE"], // allow only these HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // allow only these headers
  }),
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
