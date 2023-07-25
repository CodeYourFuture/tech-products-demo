import { Router } from "express";

const getToken = (req) => {
	const authHeader = req.get("Authorization");
	if (!authHeader) {
		throw new Error("missing header: Authorization");
	}
	const [scheme, token] = authHeader.split(" ");
	if (!["Bearer", "token"].includes(scheme)) {
		throw new Error(`invalid scheme: ${scheme}`);
	}
	return token;
};

export default function createRoutes(data) {
	const router = Router();

	router.get("/user", (req, res) => {
		res.json(data[getToken(req)]?.user);
	});

	router.get("/user/emails", (req, res) => {
		res.json(data[getToken(req)]?.emails);
	});

	const unauthenticated = (err, req, res, next) => {
		if (!res.headersSent) {
			console.error(err);
			res.status(401).json({ message: "Requires authentication" });
		}
		next(err);
	};

	router.use(unauthenticated);

	return router;
}
