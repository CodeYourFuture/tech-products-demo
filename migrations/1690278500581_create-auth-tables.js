/* eslint-disable no-unused-vars */
const { PgLiteral } = require("node-pg-migrate");

/**
 * Defines changes to be made to the database schema to accommodate new functionality.
 *
 * See {@link https://salsita.github.io/node-pg-migrate/#/migrations?id=defining-migrations the docs}.
 *
 * @param {MigrationBuilder} pgm
 * @returns {void | Promise<void>}
 */
exports.up = (pgm) => {
	pgm.createTable("sessions", {
		expire: { notNull: true, type: "timestamp(6)" },
		sess: { notNull: true, type: "json" },
		sid: { collation: '"default"', notNull: true, type: "varchar" },
	});
	pgm.createConstraint("sessions", "session_pkey", {
		primaryKey: "sid",
	});
	pgm.createIndex("sessions", "expire");
	pgm.createTable("users", {
		id: "uuid",
		email: "text",
		github_id: "int",
		name: "text",
	});
};

/**
 * Reverses the "up" migration to return the database to its initial state.
 *
 * @param {MigrationBuilder} pgm
 * @returns {void | Promise<void>}
 */
exports.down = (pgm) => {
	pgm.dropTable("users");
	pgm.dropIndex("sessions", "expire");
	pgm.dropConstraint("sessions", "session_pkey");
	pgm.dropTable("sessions");
};

/**
 * Create new shorthand column definitions for this and any future migrations.
 *
 * @type {ColumnDefinitions | undefined}
 */
exports.shorthands = {
	uuid: {
		default: PgLiteral.create("gen_random_uuid()"),
		primaryKey: true,
		type: "UUID",
	},
};

/**
 * Importing library types for less verbose type hints.
 * @typedef {import("node-pg-migrate").MigrationBuilder} MigrationBuilder
 * @typedef {import("node-pg-migrate").ColumnDefinitions} ColumnDefinitions
 */
