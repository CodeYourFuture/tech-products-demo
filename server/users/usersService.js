import * as repository from "./usersRepository";

export async function create(user) {
	return await repository.add(user);
}

export async function findByGitHubId(id) {
	return await repository.findOneByGitHubId(id);
}

export async function findById(id) {
	return await repository.getOne(id);
}
