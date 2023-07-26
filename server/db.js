import pgSession from "connect-pg-simple";
import session, { MemoryStore } from "express-session";
import { Pool } from "pg";

import config from "./utils/config";
import logger from "./utils/logger";

/**
 * Access this with `import db from "path/to/db";` then use it with
 * `await db.query("<SQL>", [...<variables>])`.
 */
export default {
	query: (...args) => {
		if (!config.production) {
			logger.debug("Postgres querying %O", args);
		} else {
			logger.debug("Postgres querying %s", args[0]);
		}
		return pool.query.apply(pool, args);
	},
};

const pool = new Pool({
	connectionString: config.dbUrl,
	connectionTimeoutMillis: 5_000,
	ssl: config.dbUrl.includes("localhost")
		? false
		: { rejectUnauthorized: false },
});

export const connectDb = async () => {
	let client;
	try {
		client = await pool.connect();
	} catch (err) {
		logger.error("%O", err);
		process.exit(1);
	}
	logger.info("Postgres connected to %s", client.database);
	client.release();
};

export const disconnectDb = () => pool.end();

export function getSessionStore() {
	const store = config.sessionStore;
	switch (store) {
		case "memory":
			return new MemoryStore();
		case "postgres":
			return new (pgSession(session))({ pool, tableName: "sessions" });
		default:
			throw new Error(`unknown store type: ${store}`);
	}
}
