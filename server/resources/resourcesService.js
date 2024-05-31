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
	{ status = "published" },
	{ page = 1, perPage = 20 }
) {
	const resources = await repository.findAll({
		status,
		limit: perPage,
		offset: (page - 1) * perPage,
	});
	const totalCount = await repository.count({ status });
	return {
		lastPage: Math.ceil(totalCount / perPage) || 1,
		page,
		perPage,
		resources,
		totalCount,
	};
}

export async function action(resourceId, status, publisherId) {
	if (!(await repository.findOne(resourceId))) {
		throw new MissingResource(resourceId);
	}
	return await repository.update(resourceId, {
		status,
		statusChangedBy: publisherId,
		statusChangedDate: new Date(),
	});
}
