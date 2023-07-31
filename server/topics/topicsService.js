import * as repository from "./topicsRepository";

export async function getAll() {
	return await repository.getAll();
}
