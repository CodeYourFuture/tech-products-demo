import http from "node:http";

import app from "./app";
import { connectDb } from "./db";
import config from "./utils/config";
import logger from "./utils/logger";

const server = http.createServer(app);

server.on("listening", () => {
	const addr = server.address();
	const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
	logger.info("listening on: %s", bind);
});

process.on("uncaughtException", (err) => {
	logger.error("Uncaught Exception: ", err.message);
	process.exit(1);
});

process.on("unhandledRejection", (reason) => {
	logger.error("Unhandled Rejection: ", reason);
	process.exit(1);
});

process.on("SIGTERM", () => {
	logger.info("SIGTERM received. Shutting down gracefully...");
	server.close(() => {
		logger.info("Server closed.");
	});
});

connectDb()
	.then(() => server.listen(config.port))
	.catch((err) => {
		logger.error("Failed to connect to the database: ", err.message);
		process.exit(1);
	});
