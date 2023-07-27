const { Pool } = require("pg");
const format = require("pg-format");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

module.exports = {
	async closeConnection() {
		await pool.end();
	},
	async clearDb(skip = ["pgmigrations"]) {
		const { rows } = await pool.query(
			format(
				"SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public' AND tablename NOT IN (%L);",
				skip
			)
		);
		for (const { tablename } of rows) {
			await pool.query(format("TRUNCATE TABLE %I;", tablename));
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
