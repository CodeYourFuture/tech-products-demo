import "dotenv/config";

export default {
	dbUrl: process.env.DATABASE_URL,
	logLevel: process.env.LOG_LEVEL?.toLowerCase() ?? "info",
	port: parseInt(process.env.PORT ?? "4201", 10),
	production: process.env.NODE_ENV?.toLowerCase() === "production",
};
