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

export const findOneByGitHubId = async (id) => {
	const {
		rows: [found],
	} = await db.query("SELECT * FROM users WHERE github_id = $1;", [id]);
	return found;
};

export async function getOne(id) {
	const {
		rows: [found],
	} = await db.query("SELECT * FROM users WHERE id = $1;", [id]);
	if (!found) {
		throw new Error(`User ${id} not found`);
	}
	return found;
}
