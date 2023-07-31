import db from "../db";

export async function getAll() {
	const { rows } = await db.query("SELECT * FROM topics;");
	return rows;
}
