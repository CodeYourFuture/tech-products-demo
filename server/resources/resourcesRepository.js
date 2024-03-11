import db, { ErrorCodes, insertQuery, singleLine, updateQuery } from "../db";

import { DuplicateResource } from "./resourcesService";

const resourceQuery = singleLine`
	SELECT r.*, t.name as topic_name
	FROM resources as r
	LEFT JOIN topics as t
	ON r.topic = t.id
`;

const pagedResourceQuery = singleLine`
		${resourceQuery}
		WHERE draft = $1
		ORDER BY accession DESC
		LIMIT $2
		OFFSET $3;
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

export const findAll = async ({ draft, limit, offset }) => {
	const pagedResult = await db.query(pagedResourceQuery, [
		draft,
		limit,
		offset,
	]);

	const findAllResourceQuery =
		draft === false
			? `${resourceQuery} WHERE draft = false`
			: `${resourceQuery} WHERE draft = true`;
	const findAllResource = await db.query(findAllResourceQuery);

	return {
		pagedResult: pagedResult.rows,
		findAllResource: findAllResource.rows,
	};
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
