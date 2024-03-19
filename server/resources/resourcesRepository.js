import db, { ErrorCodes, insertQuery, singleLine, updateQuery } from "../db";

import { DuplicateResource } from "./resourcesService";

const resourceQuery = singleLine`
	SELECT r.*, t.name as topic_name
	FROM resources as r
	LEFT JOIN topics as t
	ON r.topic = t.id
`;

export const add = async ({ description, source, title, topic, url }) => {
	try {
		const {
			rows: [created],
		} = await db.query(
			insertQuery("resources", [
				"description",
				"source",
				"title",
				"topic",
				"url",
			]),
			[description, source, title, topic, url]
		);
		return created;
	} catch (err) {
		if (err.code === ErrorCodes.UNIQUE_VIOLATION) {
			throw new DuplicateResource();
		}
		throw err;
	}
};

export const count = async ({ draft }) => {
	const {
		rows: [{ count }],
	} = await db.query("SELECT COUNT(*) FROM resources WHERE draft = $1;", [
		draft,
	]);
	return parseInt(count, 10);
};

export const findAll = async ({ draft, limit, offset, topic }) => {
	let conditions = ["draft = $1"];
	let params = [draft];

	if (topic) {
		conditions.push("topic = $2");
		params.push(topic);
	}

	const whereClause =
		conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

	const pagedResourceQuery = `
        ${resourceQuery}
        ${whereClause}
        ORDER BY accession DESC
        LIMIT $${params.length + 1}
        OFFSET $${params.length + 2};
    `;

	try {
		const pagedResult = await db.query(pagedResourceQuery, [
			...params,
			limit,
			offset,
		]);
		return {
			pagedResult: pagedResult.rows,
		};
	} catch (error) {
		throw new Error("Failed to fetch resources");
	}
};

export const findOne = async (id) => {
	const {
		rows: [resource],
	} = await db.query(`${resourceQuery} WHERE r.id = $1;`, [id]);
	return resource;
};

export const update = async (id, { draft, publication, publisher }) => {
	const {
		rows: [updated],
	} = await db.query(
		updateQuery("resources", ["draft", "publication", "publisher"]),
		[id, draft, publication, publisher]
	);
	return updated;
};
