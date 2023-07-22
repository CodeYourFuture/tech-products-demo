/* eslint-disable no-unused-vars */
exports.shorthands = undefined;

exports.up = (pgm) => {
	pgm.addColumns("resources", { publication: "datetime" });
};

exports.down = (pgm) => {
	pgm.dropColumns("resources", ["publication"]);
};
