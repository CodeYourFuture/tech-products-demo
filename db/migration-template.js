/* eslint-disable no-unused-vars */

/**
 * Defines changes to be made to the database schema to accommodate new functionality.
 *
 * See {@link https://salsita.github.io/node-pg-migrate/#/migrations?id=defining-migrations the docs}.
 *
 * @param {MigrationBuilder} pgm
 * @returns {void | Promise<void>}
 */
exports.up = (pgm) => {};

/**
 * Reverses the "up" migration to return the database to its initial state.
 *
 * @param {MigrationBuilder} pgm
 * @returns {void | Promise<void>}
 */
exports.down = (pgm) => {};

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
