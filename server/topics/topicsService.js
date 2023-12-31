import * as repository from "./topicsRepository";

export class MissingTopic extends Error {
	constructor(id) {
		super(`Topic not found: ${id}`);
	}
}

export async function getAll() {
	return await repository.findAll();
}

export async function getById(id) {
	const topic = await repository.findOne(id);
	if (!topic) {
		throw new MissingTopic(id);
	}
	return topic;
}
