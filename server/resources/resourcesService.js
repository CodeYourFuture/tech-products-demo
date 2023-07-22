import * as repository from "./resourcesRepository";

export class MissingResource extends Error {
	constructor(id) {
		super(`Resource not found: ${id}`);
	}
}

export async function publish(id) {
	if (!(await repository.getOne(id))) {
		throw new MissingResource(id);
	}
	return await repository.update(id, { draft: false, publication: new Date() });
}

export async function getAll(includeDrafts) {
	return await repository.getAll({ draft: includeDrafts });
}

export const create = async (resource) => {
	return await repository.add(resource);
};
