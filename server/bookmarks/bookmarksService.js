import * as repository from "./bookmarksRepository";

export class MissingBookmark extends Error {
	constructor(userId, resourceId) {
		super(`Bookmark not found for user: ${userId}, resource: ${resourceId}`);
	}
}

export async function getBookmarks(userId) {
	return await repository.findByUserId(userId);
}

export const addBookmark = async (userId, resourceId) => {
	return await repository.add({ userId, resourceId });
};

export const removeBookmark = async (userId, resourceId) => {
	const deleted = await repository.remove(userId, resourceId);
	if (!deleted) {
		throw new MissingBookmark(userId, resourceId);
	}
};
