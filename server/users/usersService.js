import * as repository from "./usersRepository";

export class MissingUser extends Error {
	constructor(id) {
		super(`User not found: ${id}`);
	}
}

export async function create(user) {
	return await repository.add(user);
}

export async function findByGitHubId(id) {
	return await repository.findOneByGitHubId(id);
}

export async function getAll() {
	return await repository.findAll();
}

export async function getById(id) {
	const user = await repository.findOne(id);
	if (!user) {
		throw new MissingUser(id);
	}
	return user;
}

export async function promote(id) {
	await getById(id);
	return await repository.update(id, { is_admin: true });
}

export async function getMine({ source, user, isAdmin }) {
	const userResources = await repository.findMine({
		source,
		isAdmin,
	});
	const totalCount = userResources.length;
	return {
		user,
		resources: userResources,
		totalCount,
	};
}
