/* eslint-disable no-unused-vars */

/**
 * Defines changes to be made to the database schema to accommodate new functionality.
 *
 * See {@link https://salsita.github.io/node-pg-migrate/#/migrations?id=defining-migrations the docs}.
 *
 * @param {MigrationBuilder} pgm
 * @returns {void | Promise<void>}
 */
exports.up = (pgm) => {
	pgm.alterColumn("users", "name", { notNull: true });
	pgm.alterColumn("users", "github_id", { notNull: true });
	pgm.addConstraint("users", "unique_github_ids", { unique: ["github_id"] });
};

/**
 * Reverses the "up" migration to return the database to its initial state.
 *
 * @param {MigrationBuilder} pgm
 * @returns {void | Promise<void>}
 */
exports.down = (pgm) => {
	pgm.dropConstraint("users", "unique_github_ids");
	pgm.alterColumn("users", "github_id", { notNull: false });
	pgm.alterColumn("users", "name", { notNull: false });
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
