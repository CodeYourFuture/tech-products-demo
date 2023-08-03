import pgSession from "connect-pg-simple";
import session, { MemoryStore } from "express-session";
import { Pool } from "pg";
import format from "pg-format";

import config from "./utils/config";
import logger from "./utils/logger";

const pool = new Pool({
	connectionString: config.dbUrl,
	connectionTimeoutMillis: 5_000,
	ssl: config.dbUrl.includes("localhost")
		? false
		: { rejectUnauthorized: false },
});

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

export const ErrorCodes = {
	UNIQUE_VIOLATION: "23505",
};

export const getSessionStore = () => {
	const store = config.sessionStore;
	switch (store) {
		case "memory":
			return new MemoryStore();
		case "postgres":
			return new (pgSession(session))({ pool, tableName: "sessions" });
		default:
			throw new Error(`unknown store type: ${store}`);
	}
};

/**
 * Create an insert query for the given table name and columns.
 * @param {string} tableName
 * @param {string[]} columns
 * @returns {string}
 */
export function insertQuery(tableName, columns) {
	return format(
		"INSERT INTO %I (%s) VALUES (%s) RETURNING *;",
		tableName,
		columns.map((column) => format.ident(column)).join(", "),
		columns.map((_, index) => `$${index + 1}`).join(", ")
	);
}

/**
 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates Tagged template}
 * to turn a mutliline query in backticks into a single line.
 * @example
 * const myQuery = singleLine`
 *     SELECT *
 *     FROM some_table
 *     WHERE some_field = $1;
 * `;
 * @param {string} query
 * @returns {string}
 */
export function singleLine([query]) {
	return query
		.trim()
		.split("\n")
		.map((line) => line.trim())
		.join(" ");
}
/**
 * Create an update query for the given table name and columns.
 * @param {string} tableName
 * @param {string[]} columns
 * @returns {string}
 */
export function updateQuery(tableName, columns) {
	return format(
		"UPDATE %I SET %s WHERE id = $1 RETURNING *;",
		tableName,
		columns
			.map((column, index) => `${format.ident(column)} = $${index + 2}`)
			.join(", ")
	);
}
