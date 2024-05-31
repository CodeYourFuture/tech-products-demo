import { Router } from "express";
import { Joi } from "express-validation";

import { topicsService } from "../topics";
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
		validated({
			query: Joi.object({
				status: Joi.string(),
				page: Joi.number().integer().min(1),
				perPage: Joi.number().integer().min(1),
			}).unknown(),
		}),
		asyncHandler(async (req, res) => {
			const { status, page, perPage } = req.query;
			if (status && !req.superuser && !req.user?.is_admin) {
				return res.sendStatus(403);
			}
			res.send(await service.getAll({ status }, { page, perPage }));
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
				} else if (err instanceof topicsService.MissingTopic) {
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
				status: Joi.any().valid("rejected", "published"),
			}),
		}),
		asyncHandler(async (req, res) => {
			try {
				const { status } = req.body;
				res.send(
					await service.action(req.params.id, status, req.user?.id ?? null)
				);
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
