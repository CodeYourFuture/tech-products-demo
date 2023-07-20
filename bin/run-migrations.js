#!/usr/bin/env node
require("dotenv/config");
const { default: migrate } = require("node-pg-migrate");

const configuration = require("../migration-config.json");

const connectionString = process.env.DATABASE_URL;

const options = {
	databaseUrl: {
		connectionString,
		ssl: connectionString.includes("localhost")
			? false
			: { rejectUnauthorized: configuration["reject-unauthorized"] },
	},
	dir: configuration["migrations-dir"] ?? "migrations",
	direction: process.argv.includes("down") ? "down" : "up",
	migrationsTable: configuration["migrations-table"] ?? "pgmigrations",
	verbose: true,
};

(async () => {
	try {
		await migrate(options);
		console.log("Migrations complete!");
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
})();
