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

export async function getAll(
	{ draft = false, topic },
	{ page = 1, perPage = 20 }
) {
	let resources;
	if (topic) {
		resources = await repository.findAll({
			draft,
			topic,
			limit: perPage,
			offset: (page - 1) * perPage,
		});
	} else {
		resources = await repository.findAll({
			draft,
			limit: perPage,
			offset: (page - 1) * perPage,
		});
	}

	const { pagedResult } = resources;

	const totalCount = await repository.count({ draft });
	return {
		lastPage: Math.ceil(totalCount / perPage) || 1,
		page,
		perPage,
		resources: pagedResult,
		totalCount,
	};
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
