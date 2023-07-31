import express from "express";
import { coreRouter } from "fauxauth";
import morgan from "morgan";

import createRoutes from "./api.mjs";
import users from "./users.mjs";

const app = express();
app.use(morgan("dev"));

const fauxauth = coreRouter({
	callbackUrl:
		process.env.FAUXAUTH_CALLBACK_URL ??
		"http://localhost:4201/api/auth/callback",
	clientId: process.env.FAUXAUTH_CLIENT_ID ?? "fake-client-id",
	clientSecret: process.env.FAUXAUTH_CLIENT_SECRET ?? "fake-client-secret",
	tokenMap: Object.fromEntries(users.map(({ _id, token }) => [_id, token])),
});

// Ensure the select page can render
app.set("view engine", fauxauth.views.engine);
app.set("views", fauxauth.views.directory);
app.use(fauxauth.middleware);

app.use(
	"/api",
	createRoutes(Object.fromEntries(users.map((spec) => [spec.token, spec])))
);
app.use("/login/oauth", fauxauth.routes);

export default app;
