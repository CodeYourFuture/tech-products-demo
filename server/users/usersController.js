import { Router } from "express";

import {
	asyncHandler,
	methodNotAllowed,
	sudoOnly,
	validated,
} from "../utils/middleware";
import { jsonPatch } from "../utils/validators";

import { MissingUser } from "./usersService";
import * as service from "./usersService";

const router = Router();

router
	.route("/")
	.get(
		sudoOnly,
		asyncHandler(async (req, res) => {
			res.json(await service.getAll());
		})
	)
	.all(methodNotAllowed);

router
	.route("/:id")
	.patch(
		sudoOnly,
		validated({ body: jsonPatch }),
		asyncHandler(async (req, res) => {
			const [{ op, path, value }] = req.body;
			if (
				req.body.length > 1 ||
				op !== "replace" ||
				path !== "/is_admin" ||
				value !== true
			) {
				return res.status(422).json({
					details: "Only changing the admin status to true is supported",
					error: "Unprocessable Content",
				});
			}
			try {
				res.json(await service.promote(req.params.id));
			} catch (err) {
				if (err instanceof MissingUser) {
					return res.sendStatus(404);
				}
				throw err;
			}
		})
	)
	.all(methodNotAllowed);

export default router;
