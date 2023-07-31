import { Router } from "express";

import { asyncHandler, methodNotAllowed } from "../utils/middleware";

import * as service from "./topicsService";

const router = Router();

router
	.route("/")
	.get(
		asyncHandler(async (req, res) => {
			res.json(await service.getAll());
		})
	)
	.all(methodNotAllowed);

export default router;
