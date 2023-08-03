import { topicsService } from "../topics";

import * as repository from "./resourcesRepository";

export class DuplicateResource extends Error {}

export class MissingResource extends Error {
	constructor(id) {
		super(`Resource not found: ${id}`);
	}
}

export const create = async (resource) => {
	if (resource.topic) {
		await topicsService.getById(resource.topic);
	}
	return await repository.add(resource);
};

export async function getAll(includeDrafts) {
	return await repository.getAll({ draft: includeDrafts });
}

export async function publish(resourceId, publisherId) {
	if (!(await repository.findOne(resourceId))) {
		throw new MissingResource(resourceId);
	}
	return await repository.update(resourceId, {
		draft: false,
		publisher: publisherId,
		publication: new Date(),
	});
}
