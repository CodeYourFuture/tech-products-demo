import { Router } from "express";

export default function createRoutes(data) {
	const router = Router();

	router.get("/user", bearerAuth(data), (req, res) => {
		res.json(data[req.token].user);
	});

	return router;
}

/**
 * @param {Record<string, unknown>} data
 * @returns {import("express").RequestHandler}
 */
function bearerAuth(data) {
	return (req, res, next) => {
		const authHeader = req.header("Authorization");
		if (!authHeader) {
			return res.status(401).json({ message: "Requires authentication" });
		}
		const [scheme, token] = authHeader.split(" ");
		if (scheme !== "Bearer") {
			return res.status(401).json({ message: "Requires authentication" });
		}
		if (!(token in data)) {
			return res.status(401).json({ message: "Bad credentials" });
		}
		req.token = token;
		next();
	};
}
