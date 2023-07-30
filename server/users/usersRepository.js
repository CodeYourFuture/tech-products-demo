import db from "../db";

export const add = async ({ email, gitHubId, name }) => {
	const {
		rows: [created],
	} = await db.query(
		"INSERT INTO users (email, github_id, name) VALUES ($1, $2, $3) RETURNING *;",
		[email, gitHubId, name]
	);
	return created;
};

export async function findOne(id) {
	const {
		rows: [found],
	} = await db.query("SELECT * FROM users WHERE id = $1;", [id]);
	return found;
}

export const findOneByGitHubId = async (id) => {
	const {
		rows: [found],
	} = await db.query("SELECT * FROM users WHERE github_id = $1;", [id]);
	return found;
};

export async function getAll() {
	const { rows } = await db.query("SELECT * FROM users;");
	return rows;
}

export async function update(id, { is_admin }) {
	const {
		rows: [updated],
	} = await db.query(
		"UPDATE users SET is_admin = $2 WHERE id = $1 RETURNING *;",
		[id, is_admin]
	);
	return updated;
}
