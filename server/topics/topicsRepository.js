import db from "../db";

export const findAll = async () => {
	const { rows } = await db.query("SELECT * FROM topics;");
	return rows;
};

export const findOne = async (id) => {
	const {
		rows: [topic],
	} = await db.query("SELECT * FROM topics WHERE id = $1;", [id]);
	return topic;
};
