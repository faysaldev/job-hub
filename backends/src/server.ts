import express, { Request, Response } from "express";
import cors from "cors";
import routes from "./routes/index";
import logRequestResponse from "./middlewares/logger.middleware";
import compression from "compression";
import { globalErrorHandler, notFoundHandler } from "./lib/errorsHandle";
import { corsOptions } from "./config/cors";
import stripeController from "./domains/Stripe/stripe.controller";

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", process.env.TRUST_PROXY === "true" ? 1 : false);
app.use(cors(corsOptions));
app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("X-Frame-Options", "DENY");
  next();
});
// Stripe requires the original request bytes for signature verification.
app.post("/api/v1/stripe/webhook", express.raw({ type: "application/json", limit: "128kb" }), stripeController.webhook);
app.use(express.json({ limit: "250kb" }));
app.use(express.urlencoded({ extended: true, limit: "250kb" }));
app.use(compression());
app.use(logRequestResponse);
app.get("/", (_req: Request, res: Response) => res.json({ service: "JobHub API", status: "ok" }));
app.use("/api/v1", routes);
app.use(notFoundHandler);
app.use(globalErrorHandler);
export default app;
