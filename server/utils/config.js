import "dotenv-expand/config";

const missing = ["DATABASE_URL", "SUDO_TOKEN"].filter(
	(envVar) => !process.env[envVar]
);
if (missing.length > 0) {
	throw new Error(`Missing required env vars: ${missing.join(", ")}`);
}

export default {
	dbUrl: process.env.DATABASE_URL,
	logLevel: process.env.LOG_LEVEL?.toLowerCase() ?? "info",
	port: parseInt(process.env.PORT ?? "4201", 10),
	production: process.env.NODE_ENV?.toLowerCase() === "production",
	sudoToken: process.env.SUDO_TOKEN,
};
