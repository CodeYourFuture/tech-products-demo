/* eslint-disable no-unused-vars */
exports.shorthands = undefined;

exports.up = (pgm) => {
	pgm.createTable("resources", {
		id: {
			default: pgm.func("gen_random_uuid()"),
			primaryKey: true,
			type: "UUID",
		},
		accession: { default: pgm.func("NOW()"), type: "datetime" },
		description: { type: "string" },
		draft: { default: true, type: "bool" },
		title: { notNull: true, type: "string", unique: true },
		url: { notNull: true, type: "string", unique: true },
	});
};

exports.down = (pgm) => {
	pgm.dropTable("resources");
};
