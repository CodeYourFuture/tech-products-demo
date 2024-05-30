/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
	pgm.renameColumn("resources", "draft", "status");
	pgm.renameColumn("resources", "publication", "status_changed_date");
	pgm.renameColumn("resources", "publisher", "status_changed_by");

	pgm.createType("enum", ["drafted", "published", "rejected"]);
	pgm.sql("ALTER TABLE resources ALTER COLUMN status DROP DEFAULT");
	pgm.alterColumn("resources", "status", {
		type: "enum",
		using:
			"CASE WHEN status = 'true' THEN 'drafted'::enum WHEN status = 'false' THEN 'published'::enum ELSE 'rejected'::enum END",
		default: "drafted",
	});
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
	pgm.alterColumn("resources", "status", {
		type: "boolean",
		using:
			"CASE WHEN status = 'drafted' THEN true WHEN status = 'published' THEN false ELSE null END",
	});

	pgm.dropType("enum");

	pgm.renameColumn("resources", "status", "draft");
	pgm.renameColumn("resources", "status_changed_date", "publication");
	pgm.renameColumn("resources", "status_changed_by", "publisher");
};
