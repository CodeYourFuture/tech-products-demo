import db, { singleLine } from "../db";

export class DuplicateBookmark extends Error {}

const addBookmarkQuery = singleLine`
    INSERT INTO bookmarks (user_id, resource_id)
    VALUES ($1, $2)
    ON CONFLICT (user_id, resource_id) DO NOTHING
    RETURNING *;
`;

export const add = async ({ userId, resourceId }) => {
	const {
		rows: [bookmark],
	} = await db.query(addBookmarkQuery, [userId, resourceId]);
	if (!bookmark) {
		throw new DuplicateBookmark();
	}
	return bookmark;
};

const deleteBookmarkQuery = singleLine`
    DELETE FROM bookmarks
    WHERE user_id = $1 AND resource_id = $2
    RETURNING *;
`;

export const remove = async (userId, resourceId) => {
	const {
		rows: [bookmark],
	} = await db.query(deleteBookmarkQuery, [userId, resourceId]);
	return bookmark;
};

const findBookmarksByUserIdQuery = singleLine`
    SELECT b.*, r.title
    FROM bookmarks AS b
    INNER JOIN resources AS r ON b.resource_id = r.id
    WHERE b.user_id = $1;
`;

export const findByUserId = async (userId) => {
	const { rows } = await db.query(findBookmarksByUserIdQuery, [userId]);
	return rows;
};
