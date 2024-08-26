import express from "express";
import session from "express-session";
import passport from "passport";

import apiRouter from "./api";
import { getSessionStore } from "./db";
import docsRouter from "./docs";
import config from "./utils/config";
import {
	clientRouter,
	configuredHelmet,
	configuredMorgan,
	httpsOnly,
	logErrors,
} from "./utils/middleware";

const apiRoot = "/api";
const sessionConfig = {
	cookie: {},
	resave: false,
	saveUninitialized: true,
	secret: config.sessionSecret,
	store: getSessionStore(),
};

const app = express();

app.use(express.json({ type: ["application/json", "application/*+json"] }));
app.use(express.urlencoded({ extended: true }));

app.use(configuredHelmet());
app.use(configuredMorgan());

if (config.production) {
	app.enable("trust proxy");
	sessionConfig.cookie.secure = true;
	app.use(httpsOnly());
}

app.use(session(sessionConfig));
app.use(passport.authenticate("session"));
app.use(apiRoot, apiRouter);
app.use("/docs", docsRouter);
app.use("/health", (_, res) => res.sendStatus(200));
app.use(clientRouter(apiRoot));

app.use(logErrors());

export default app;
