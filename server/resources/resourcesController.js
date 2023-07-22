import { Router } from "express";

import * as service from "./resourcesService";

const router = Router();

router
	.route("/")
	.get(async (req, res, next) => {
		const includeDrafts = req.superuser && req.query.drafts === "true";
		try {
			res.send(
				await service.getAll(includeDrafts)
			);
		} catch (err) {
			next(err);
		}
	})
	.post(async (req, res, next) => {
		try {
			const { title, url } = req.body;
			const resource = await service.create({ title, url });
			res.status(201).send(resource);
		} catch (err) {
			next(err);
		}
	})
	.all((_, res) => res.sendStatus(405));

export default router;
