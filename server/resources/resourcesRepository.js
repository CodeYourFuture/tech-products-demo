import db from "../db";

export const add = async ({ title, url }) => {
	const {
		rows: [created],
	} = await db.query(
		"INSERT INTO resources (title, url) VALUES ($1, $2) RETURNING *;",
		[title, url]
	);
	return created;
};

export const getAll = async ({ draft }) => {
	const { rows } = await db.query(
		draft
			? "SELECT * FROM resources;"
			: "SELECT * FROM resources WHERE draft = false;"
	);
	return rows;
};
