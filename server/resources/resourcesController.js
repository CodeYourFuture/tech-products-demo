import { Router } from "express";

import logger from "../utils/logger";
import { asyncHandler, methodNotAllowed, sudoOnly } from "../utils/middleware";

import * as service from "./resourcesService";

const router = Router();

router
	.route("/")
	.get(
		asyncHandler(async (req, res) => {
			const includeDrafts = req.superuser && req.query.drafts === "true";
			res.send(await service.getAll(includeDrafts));
		})
	)
	.post(
		asyncHandler(async (req, res) => {
			const { title, url } = req.body;
			const resource = await service.create({ title, url });
			res.status(201).send(resource);
		})
	)
	.all(methodNotAllowed);

router
	.route("/:id")
	.patch(
		sudoOnly,
		asyncHandler(async (req, res) => {
			if (req.body.draft !== false) {
				return res.sendStatus(400);
			}
			try {
				res.send(await service.publish(req.params.id));
			} catch (err) {
				if (err instanceof service.MissingResource) {
					logger.info(err.message);
					res.sendStatus(404);
				}
				throw err;
			}
		})
	)
	.all(methodNotAllowed);

export default router;
