import * as repository from "./resourcesRepository";

export class DuplicateResource extends Error {}

export class MissingResource extends Error {
	constructor(id) {
		super(`Resource not found: ${id}`);
	}
}

export const create = async (resource) => {
	return await repository.add(resource);
};

export async function getAll(includeDrafts) {
	return await repository.getAll({ draft: includeDrafts });
}

export async function publish(id) {
	if (!(await repository.findOne(id))) {
		throw new MissingResource(id);
	}
	return await repository.update(id, { draft: false, publication: new Date() });
}
