import { Router } from "express";

import resourcesRouter from "./resources";
import logger from "./utils/logger";
import { sudo } from "./utils/middleware";

const router = Router();

router.use(sudo);

router.get("/", (_, res) => {
	logger.debug("Welcoming everyone...");
	res.json({ message: "Hello, world!" });
});

router.use("/resources", resourcesRouter);

export default router;
