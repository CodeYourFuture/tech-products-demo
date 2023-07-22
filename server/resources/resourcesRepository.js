import db from "../db";

export const getOne = async (id) => {
	const {
		rows: [resource],
	} = await db.query("SELECT * FROM resources WHERE id = $1;", [id]);
	return resource;
};

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

export const update = async (id, { draft, publication }) => {
	const {
		rows: [updated],
	} = await db.query(
		"UPDATE resources SET draft = $2, publication = $3 WHERE id = $1 RETURNING *;",
		[id, draft, publication]
	);
	return updated;
};
