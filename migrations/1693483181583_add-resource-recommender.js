/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
	pgm.addColumns(
		"resources",
		{ recommender: { type: "UUID", notNull: false, default: null } },
		{ ifNotExists: true }
	);
};

exports.down = (pgm) => {
	pgm.dropColumns("resources", ["recommender"], { ifExists: true });
};
