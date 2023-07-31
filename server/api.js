import { Router } from "express";

import authRouter from "./auth";
import resourcesRouter from "./resources";
import topicsRouter from "./topics";
import usersRouter from "./users";
import { sudo } from "./utils/middleware";

const router = Router();

router.use(sudo);

router.use("/auth", authRouter);

router.use("/resources", resourcesRouter);

router.use("/topics", topicsRouter);

router.use("/users", usersRouter);

export default router;
