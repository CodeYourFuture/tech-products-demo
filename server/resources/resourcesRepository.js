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
		WHERE status = $1
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

export const count = async ({ status }) => {
	const {
		rows: [{ count }],
	} = await db.query("SELECT COUNT(*) FROM resources WHERE status = $1;", [
		status,
	]);
	return parseInt(count, 10);
};

export const findAll = async ({ status, limit, offset }) => {
	const { rows } = await db.query(pagedResourceQuery, [status, limit, offset]);
	return rows;
};

export const findOne = async (id) => {
	const {
		rows: [resource],
	} = await db.query(`${resourceQuery} WHERE r.id = $1;`, [id]);
	return resource;
};

export const update = async (
	id,
	{ status, statusChangedDate, statusChangedBy }
) => {
	const {
		rows: [updated],
	} = await db.query(
		updateQuery("resources", [
			"status",
			"status_changed_date",
			"status_changed_by",
		]),
		[id, status, statusChangedDate, statusChangedBy]
	);
	return updated;
};
