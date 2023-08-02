import { Router } from "express";
import { Joi } from "express-validation";

import { MissingTopic } from "../topics/topicsService";
import logger from "../utils/logger";
import {
	asyncHandler,
	authOnly,
	methodNotAllowed,
	sudoOnly,
	validated,
} from "../utils/middleware";

import { DuplicateResource } from "./resourcesService";
import * as service from "./resourcesService";

const router = Router();

router
	.route("/")
	.get(
		validated({ query: Joi.object({ drafts: Joi.boolean() }).unknown() }),
		asyncHandler(async (req, res) => {
			const includeDrafts =
				(req.superuser || req.user?.is_admin) && req.query.drafts === "true";
			res.send(await service.getAll(includeDrafts));
		})
	)
	.post(
		authOnly,
		validated({
			body: Joi.object({
				description: Joi.string(),
				title: Joi.string().required(),
				topic: Joi.string().uuid(),
				url: Joi.string().uri({ allowRelative: false }).required(),
			}),
		}),
		asyncHandler(async (req, res) => {
			const { id: source } = req.user;
			try {
				const resource = await service.create({ ...req.body, source });
				res.status(201).send(resource);
			} catch (err) {
				if (err instanceof DuplicateResource) {
					return res.sendStatus(409);
				} else if (err instanceof MissingTopic) {
					return res.status(400).json({ topic: '"topic" must exist' });
				}
				throw err;
			}
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
				res.send(await service.publish(req.params.id, req.user?.id ?? null));
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
