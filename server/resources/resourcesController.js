import { Router } from "express";

import { asyncHandler } from "../utils/middleware";

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
	.all((_, res) => res.sendStatus(405));

export default router;
