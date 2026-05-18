import connectionToDb from "./config/db";
import { PORT } from "./config/ENV";
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

const backendIp = "localhost";
const port = PORT || 3000;

server.listen(Number(port), backendIp, () => {
  console.log(
    `[Server] Express + Socket.IO running at http://${backendIp}:${port}`,
  );
});
