import { timingSafeEqual } from "node:crypto";
import { join } from "node:path";

import express, { Router } from "express";
import { validate, ValidationError } from "express-validation";
import helmet from "helmet";
import morgan from "morgan";

import config from "./config";
import logger from "./logger";

export const asyncHandler = (handler) => async (req, res, next) => {
	try {
		await handler(req, res, next);
	} catch (err) {
		next(err);
	}
};

export const authOnly = (req, res, next) => {
	if (req.user) {
		return next();
	}
	res.sendStatus(401);
};

export const clientRouter = (apiRoot) => {
	const staticDir = join(__dirname, "..", "static");
	const router = Router();
	router.use(express.static(staticDir));
	router.use((req, res, next) => {
		if (req.method === "GET" && !req.url.startsWith(apiRoot)) {
			return res.sendFile(join(staticDir, "index.html"));
		}
		next();
	});
	return router;
};

export const configuredHelmet = () => helmet({ contentSecurityPolicy: false });

export const configuredMorgan = () =>
	morgan("dev", {
		stream: { write: (message) => logger.info(message.trim()) },
	});

export const httpsOnly = () => (req, res, next) => {
	if (!req.secure) {
		return res.redirect(301, `https://${req.headers.host}${req.originalUrl}`);
	}
	next();
};

export const logErrors = () => (err, _, res, next) => {
	if (res.headersSent) {
		return next(err);
	}
	logger.error("%O", err);
	res.sendStatus(500);
};

export const methodNotAllowed = (_, res) => res.sendStatus(405);

export const sudo = (req, res, next) => {
	const sudoToken = Buffer.from(config.sudoToken);
	const header = req.get("Authorization");
	const headerToken = header?.startsWith("Bearer ") && header?.slice(7);
	req.superuser = timingSafeEqual(
		sudoToken,
		Buffer.alloc(sudoToken.length, headerToken)
	);
	next();
};

export const sudoOnly = (req, res, next) => {
	if (req.superuser) {
		return next();
	}
	res.sendStatus(401);
};

export const validated = (rules) => (req, res, next) => {
	validate(rules, { keyByField: true }, { abortEarly: false })(
		req,
		res,
		(err) => {
			if (err instanceof ValidationError) {
				return res.status(400).json(Object.assign({}, ...err.details));
			}
			next(err);
		}
	);
};
