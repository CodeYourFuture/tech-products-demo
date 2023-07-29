/* eslint-disable no-unused-vars */
const format = require("pg-format");
/**
 * Defines changes to be made to the database schema to accommodate new functionality.
 *
 * See {@link https://salsita.github.io/node-pg-migrate/#/migrations?id=defining-migrations the docs}.
 *
 * @param {MigrationBuilder} pgm
 * @returns {void | Promise<void>}
 */
exports.up = (pgm) => {
	pgm.sql(format("TRUNCATE TABLE %I;", "resources"));
	pgm.addColumn("resources", {
		source: { notNull: true, type: "UUID" },
	});
	pgm.addConstraint("resources", "FK_resources_users", {
		foreignKeys: {
			columns: "source",
			references: "users(id)",
		},
	});
};

/**
 * Reverses the "up" migration to return the database to its initial state.
 *
 * @param {MigrationBuilder} pgm
 * @returns {void | Promise<void>}
 */
exports.down = (pgm) => {
	pgm.dropConstraint("resources", "FK_resources_users");
	pgm.dropColumn("resources", "source");
};

/**
 * Create new shorthand column definitions for this and any future migrations.
 *
 * @type {ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * Importing library types for less verbose type hints.
 * @typedef {import("node-pg-migrate").MigrationBuilder} MigrationBuilder
 * @typedef {import("node-pg-migrate").ColumnDefinitions} ColumnDefinitions
 */
