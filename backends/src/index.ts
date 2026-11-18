import connectionToDb from "./config/db";
import { PORT, BACKEND_IP } from "./config/ENV";
import setUpSocketIO from "./config/socketio";
import { assertAuthSecrets } from "./domains/Auth/auth.token.services";
import app from "./server";
import http from "node:http";
import { assertMailConfigured, verifyMailConnection } from "./lib/mail.service";
import { startMailOutboxWorker } from "./lib/mail.outbox";

/** Do not accept HTTP or Socket.IO requests before the database is ready. */
const main = async () => {
  assertAuthSecrets();
  if (process.env.NODE_ENV === "production" || process.env.MAIL_REQUIRED === "true") assertMailConfigured();
  await connectionToDb();
  if (process.env.MAIL_VERIFY_ON_STARTUP === "true") await verifyMailConnection();
  startMailOutboxWorker();
  const server = http.createServer(app);
  setUpSocketIO(server);
  const port = PORT || 3001;
  server.listen(port, BACKEND_IP || "0.0.0.0", () => {
    console.info(`[JobHub] HTTP & Socket.IO server listening on ${port}`);
  });
};
void main().catch((error) => {
  console.error("JobHub startup failed:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
