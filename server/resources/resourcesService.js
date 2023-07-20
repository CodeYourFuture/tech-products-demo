import * as repository from "./resourcesRepository";

export const create = async ({ title, url }) => {
	return await repository.add({ title, url });
};
