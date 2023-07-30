import db from "../db";

import { DuplicateResource } from "./resourcesService";

export const add = async ({ description, source, title, url }) => {
	try {
		const {
			rows: [created],
		} = await db.query(
			"INSERT INTO resources (description, source, title, url) VALUES ($1, $2, $3, $4) RETURNING *;",
			[description, source, title, url]
		);
		return created;
	} catch (err) {
		if (err.code === "23505" /** unique_violation */) {
			throw new DuplicateResource();
		}
		throw err;
	}
};

export const findOne = async (id) => {
	const {
		rows: [resource],
	} = await db.query("SELECT * FROM resources WHERE id = $1;", [id]);
	return resource;
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
