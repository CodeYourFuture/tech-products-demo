import { Router } from "express";

import resourcesRouter from "./resources";
import logger from "./utils/logger";

const router = Router();

router.get("/", (_, res) => {
	logger.debug("Welcoming everyone...");
	res.json({ message: "Hello, world!" });
});

router.use("/resources", resourcesRouter);

export default router;
