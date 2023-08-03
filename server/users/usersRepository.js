import db, { insertQuery } from "../db";

export const add = async ({ email, gitHubId, name }) => {
	const {
		rows: [created],
	} = await db.query(insertQuery("users", ["email", "github_id", "name"]), [
		email,
		gitHubId,
		name,
	]);
	return created;
};

export const findAll = async () => {
	const { rows } = await db.query("SELECT * FROM users;");
	return rows;
};

export const findOne = async (id) => {
	const {
		rows: [found],
	} = await db.query("SELECT * FROM users WHERE id = $1;", [id]);
	return found;
};

export const findOneByGitHubId = async (id) => {
	const {
		rows: [found],
	} = await db.query("SELECT * FROM users WHERE github_id = $1;", [id]);
	return found;
};

export const update = async (id, { is_admin }) => {
	const {
		rows: [updated],
	} = await db.query(
		"UPDATE users SET is_admin = $2 WHERE id = $1 RETURNING *;",
		[id, is_admin]
	);
	return updated;
};
