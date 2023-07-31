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
	pgm.createTable("topics", {
		id: "uuid",
		name: "text",
	});
	pgm.sql(`
		INSERT INTO topics (name) VALUES
			('Git'),
			('HTML/CSS'),
			('JavaScript'),
			('Node & Express'),
			('Professional Development'),
			('React'),
			('SQL & Postgres');
	`);
	pgm.addColumn("resources", {
		topic: { references: "topics(id)", type: "UUID" },
	});
};

/**
 * Reverses the "up" migration to return the database to its initial state.
 *
 * @param {MigrationBuilder} pgm
 * @returns {void | Promise<void>}
 */
exports.down = (pgm) => {
	pgm.dropColumn("resources", "topic");
	pgm.dropTable("topics");
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
