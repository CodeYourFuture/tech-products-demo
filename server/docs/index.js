import path from "node:path";

import { Router } from "express";
import swaggerJsDoc from "swagger-jsdoc";
import { serve, setup } from "swagger-ui-express";

const router = Router();

router.use("/", serve);

router.get(
	"/",
	setup(
		swaggerJsDoc({
			apis: [path.join(__dirname, "*.yml")],
			swaggerDefinition: {
				openapi: "3.0.0",
				info: {
					title: "Tech Products Demo",
					version: "1.0.0",
					description: "Demonstrating an effective way of working.",
					license: {
						name: "Licensed Under ISC",
						url: "https://codeyourfuture.io/",
					},
					contact: {
						name: "CYF",
						url: "https://codeyourfuture.io/",
					},
				},
				servers: [{ url: "/api" }],
			},
		})
	)
);

export default router;
