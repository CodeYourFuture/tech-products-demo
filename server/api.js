import { Router } from "express";

import authRouter from "./auth";
import resourcesRouter from "./resources";
import { sudo } from "./utils/middleware";

const router = Router();

router.use(sudo);

router.use("/auth", authRouter);

router.use("/resources", resourcesRouter);

export default router;
