import db, { singleLine } from "../db";

import { DuplicateResource } from "./resourcesService";

export const add = async ({ description, source, title, topic, url }) => {
	try {
		const {
			rows: [created],
		} = await db.query(
			"INSERT INTO resources (description, source, title, topic, url) VALUES ($1, $2, $3, $4, $5) RETURNING *;",
			[description, source, title, topic, url]
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
	} = await db.query(`${resourceQuery} WHERE r.id = $1;`, [id]);
	return resource;
};

export const getAll = async ({ draft }) => {
	const { rows } = await db.query(
		draft ? `${resourceQuery};` : `${resourceQuery} WHERE r.draft = false;`
	);
	return rows;
};

export const update = async (id, { draft, publication, publisher }) => {
	const {
		rows: [updated],
	} = await db.query(
		"UPDATE resources SET draft = $2, publication = $3, publisher = $4 WHERE id = $1 RETURNING *;",
		[id, draft, publication, publisher]
	);
	return updated;
};

const resourceQuery = singleLine`
	SELECT r.*, t.name as topic_name
	FROM resources as r
	LEFT JOIN topics as t
	ON r.topic = t.id
`;
