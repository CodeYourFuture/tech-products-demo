import { Router } from "express";

import { asyncHandler, authOnly } from "../utils/middleware";

import { DuplicateBookmark } from "./bookmarksRepository";
import * as service from "./bookmarksService";

const router = Router();

router.get(
	"/",
	authOnly,
	asyncHandler(async (req, res) => {
		const bookmarks = await service.getBookmarks(req.user.id);
		res.json(bookmarks);
	})
);

router.post(
	"/",
	authOnly,
	asyncHandler(async (req, res) => {
		const { resourceId } = req.body;
		try {
			const newBookmark = await service.addBookmark(req.user.id, resourceId);
			res.status(201).json(newBookmark);
		} catch (error) {
			if (error instanceof DuplicateBookmark) {
				res.status(409).json({ message: "Bookmark already exists." });
			} else {
				res.sendStatus(500);
			}
		}
	})
);

router.delete(
	"/:id",
	authOnly,
	asyncHandler(async (req, res) => {
		const { id } = req.params;
		try {
			await service.removeBookmark(req.user.id, id);
			res.sendStatus(204);
		} catch (error) {
			res.sendStatus(500);
		}
	})
);

export default router;
