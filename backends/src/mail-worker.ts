/** Run this as a scheduled Cloud Run Job or cron task (every minute).
 * Uses the same durable MongoDB outbox as the HTTP server, without exposing a new API endpoint.
 * This is important for request-scoped CPU instances where background timers are throttled.
 */
import connectionToDb from "./config/db";
import { assertAuthSecrets } from "./domains/Auth/auth.token.services";
import { assertMailConfigured, verifyMailConnection, closeMailTransport } from "./lib/mail.service";
import { deliverQueuedEmails } from "./lib/mail.outbox";
import mongoose from "mongoose";

const main = async () => {
  assertAuthSecrets();
  assertMailConfigured();
  await connectionToDb();
  if (process.env.MAIL_VERIFY_ON_STARTUP === "true") await verifyMailConnection();
  const completed = await deliverQueuedEmails();
  console.info(`[JobHub mail worker] processed ${completed} messages`);
  closeMailTransport();
  await mongoose.disconnect();
};
void main().catch((error) => {
  console.error("[JobHub mail worker] failed:", error instanceof Error ? error.message : "Unknown error");
  process.exitCode = 1;
});
