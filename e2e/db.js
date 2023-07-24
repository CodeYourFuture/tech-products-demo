const { Pool } = require("pg");
const format = require("pg-format");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

module.exports = {
	async closeConnection() {
		await pool.end();
	},
	async clearDb() {
		for (const table of ["resources"]) {
			await pool.query(format("TRUNCATE TABLE %I;", table));
		}
		return null;
	},
	async seed({ resources = [] }) {
		for (const { description, draft, title, url } of resources) {
			await pool.query(
				"INSERT INTO resources (description, draft, title, url) VALUES ($1, $2, $3, $4);",
				[description, draft, title, url]
			);
		}
		return null;
	},
};
