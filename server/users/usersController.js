import { Router } from "express";
import { Joi } from "express-validation";

import {
	asyncHandler,
	methodNotAllowed,
	sudoOnly,
	validated,
} from "../utils/middleware";

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
		validated({
			body: Joi.object({
				is_admin: Joi.boolean(),
			}),
		}),
		asyncHandler(async (req, res) => {
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
