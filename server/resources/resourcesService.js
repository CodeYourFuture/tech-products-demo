import * as repository from "./resourcesRepository";

export async function getAll(includeDrafts) {
	return await repository.getAll({ draft: includeDrafts });
}

export const create = async ({ title, url }) => {
	return await repository.add({ title, url });
};
