import connectionToDb from "./config/db";
import { PORT, BACKEND_IP } from "./config/ENV";
import setUpSocketIO from "./config/socketio";
import app from "./server";
import dotenv from "dotenv";
import http from "http";

// Load environment variables
dotenv.config();

// Connect to database
connectionToDb();

// Create a single HTTP server for both Express and Socket.IO
const server = http.createServer(app);

// Initialize Socket.IO on the same server/port
setUpSocketIO(server);

const backendIp = BACKEND_IP || "0.0.0.0";
const port = PORT || 3000;

server.listen(Number(port), backendIp, () => {
  console.log(
    `[Server] Express + Socket.IO running at http://${backendIp}:${port}`,
  );
});
