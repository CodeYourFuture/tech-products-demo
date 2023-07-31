const { Pool } = require("pg");
const format = require("pg-format");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

module.exports = {
	async closeConnection() {
		await pool.end();
	},
	async clearDb(tables = ["resources", "sessions", "users"]) {
		for (const tableName of tables) {
			await pool.query(format("TRUNCATE TABLE %I CASCADE;", tableName));
		}
		return null;
	},
	async seed(data) {
		for (const [table, records] of Object.entries(data)) {
			await pool.query(insertQuery(table, records));
		}
		return null;
	},
};

/**
 * Create a query to insert all records into the specified table.
 * @param {string} table
 * @param {object[]} records
 * @returns {string}
 */
function insertQuery(table, records) {
	const allFields = new Set();
	records.forEach((record) =>
		Object.keys(record).forEach((field) => allFields.add(field))
	);
	const fields = [...allFields];
	const values = records.map((record) => fields.map((field) => record[field]));
	return format(
		"INSERT INTO %I (%s) VALUES %L;",
		table,
		fields.map((field) => format.ident(field)).join(", "),
		values
	);
}
