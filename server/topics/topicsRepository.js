import db from "../db";

export async function getAll() {
	const { rows } = await db.query("SELECT * FROM topics;");
	return rows;
}

export async function findOne(id) {
	const {
		rows: [topic],
	} = await db.query("SELECT * FROM topics WHERE id = $1;", [id]);
	return topic;
}
