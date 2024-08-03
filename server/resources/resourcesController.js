import { Router } from "express";
import { Joi } from "express-validation";

import db, { singleLine } from "../db";
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
				draft: Joi.boolean(),
				page: Joi.number().integer().min(1),
				perPage: Joi.number().integer().min(1),
			}).unknown(),
		}),
		asyncHandler(async (req, res) => {
			const { draft, page, perPage } = req.query;
			if (draft && !req.superuser && !req.user?.is_admin) {
				return res.sendStatus(403);
			}
			res.send(await service.getAll({ draft }, { page, perPage }));
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
	.get(
		asyncHandler(async (req, res) => {
			const {
				rows: [resource],
			} = await db.query(
				singleLine`
			SELECT r.*, t.name AS topic_name, us.name AS source_name, up.name AS publisher_name
			FROM resources AS r
			INNER JOIN users AS us ON r.source = us.id
			LEFT JOIN users AS up ON r.publisher = up.id
			LEFT JOIN topics AS t ON r.topic = t.id
			WHERE r.id = $1;
		`,
				[req.params.id]
			);
			if (!resource) {
				return res.sendStatus(404);
			}
			res.json(resource);
		})
	)
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
