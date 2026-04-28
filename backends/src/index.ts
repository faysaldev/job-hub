import connectionToDb from "./config/db";
import { PORT, SOCKET_PORT } from "./config/ENV";
import setUpSocketIO from "./config/socketio";
import app from "./server";
import dotenv from "dotenv";
import http from "http";

// Loading the local Environment Variables from .env file
dotenv.config();

// connection to the database
connectionToDb();

// creating server for Express app
const server = http.createServer(app);

// using the port and ip over here
const backendIp = "localhost";
const port = PORT || 3000;
const socketPort = SOCKET_PORT || 6100;

// Create a separate HTTP server for sockets
const socketServer = http.createServer();
setUpSocketIO(socketServer);

// Start Express server
server.listen(Number(port), backendIp, () => {
  console.log(`Server is running at http://${backendIp}:${port}`);
});

// Start Socket server on separate port
socketServer.listen(Number(socketPort), backendIp, () => {
  console.log(`Socket running at ws://${backendIp}:${socketPort}`);
});

// import connectionToDb from "./config/db";
// import setUpSocketIO from "./config/socketio";
// import app from "./server";
// import dotenv from "dotenv";
// import http from "http";

// // Loading the local Environment Variables from .env file
// dotenv.config();

// // connection to the database
// connectionToDb();

// // creating server
// const server = http.createServer(app);

// // initialize the socket io
// const io = setUpSocketIO(server);

// //using the post and ip over here
// const backendIp = process.env.BACKEND_IP || "localhost";
// const port = process.env.PORT || 3000;

// server.listen(Number(port), backendIp, () => {
//   console.log(`Server is running at http://${backendIp}:${port}`);
// });
