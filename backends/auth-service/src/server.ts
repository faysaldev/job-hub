import express, { Request, Response } from "express";
import cors from "cors";
import routes from "./routes/index";
import logRequestResponse from "./middlewares/logger.middleware";
import compression from "compression";

const app = express();

// Enable CORS for all routes
app.use(
  cors({
    origin: "*", // Allow all origins - adjust this for production
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true, // Allow credentials to be sent with requests
  })
);

app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// compression the all data
app.use(compression());

// Use the logging middleware for all routes
app.use(logRequestResponse);
// Use the centralized routes
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript with Node and Express!");
});
app.use("/api/v1", routes); // This mounts all the routes under the /api prefix (e.g., /api/user)

export default app;
