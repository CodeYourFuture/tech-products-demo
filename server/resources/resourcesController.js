import { Router } from "express";
import { Joi } from "express-validation";

import logger from "../utils/logger";
import {
	asyncHandler,
	authOnly,
	methodNotAllowed,
	sudoOnly,
	validated,
} from "../utils/middleware";

import * as service from "./resourcesService";

const router = Router();

router
	.route("/")
	.get(
		validated({ query: Joi.object({ drafts: Joi.boolean() }).unknown() }),
		asyncHandler(async (req, res) => {
			const includeDrafts = req.superuser && req.query.drafts === "true";
			res.send(await service.getAll(includeDrafts));
		})
	)
	.post(
		authOnly,
		validated({
			body: Joi.object({
				description: Joi.string().empty(""),
				title: Joi.string().required(),
				url: Joi.string().uri({ allowRelative: false }).required(),
			}),
		}),
		asyncHandler(async (req, res) => {
			const { id: source } = req.user;
			const { description, title, url } = req.body;
			const resource = await service.create({
				description,
				source,
				title,
				url,
			});
			res.status(201).send(resource);
		})
	)
	.all(methodNotAllowed);

router
	.route("/:id")
	.patch(
		sudoOnly,
		validated({
			body: Joi.object({
				draft: Joi.any().valid(false),
			}),
		}),
		asyncHandler(async (req, res) => {
			try {
				res.send(await service.publish(req.params.id));
			} catch (err) {
				if (err instanceof service.MissingResource) {
					logger.info(err.message);
					return res.sendStatus(404);
				}
				throw err;
			}
		})
	)
	.all(methodNotAllowed);

export default router;
