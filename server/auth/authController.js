import { Router } from "express";
import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";

import config from "../utils/config";
import { authOnly, methodNotAllowed } from "../utils/middleware";

import * as service from "./authService";

const router = Router();

passport.use(
	"github",
	new GitHubStrategy(
		{
			...config.oauth,
			scopeSeparator: " ",
			scope: ["read:user", "user:email"],
		},
		async (accessToken, refreshToken, profile, done) => {
			try {
				const user = await service.logIn(profile);
				done(null, user);
			} catch (err) {
				done(err);
			}
		}
	)
);

passport.deserializeUser(async (user, done) => {
	try {
		done(null, await service.deserialize(user));
	} catch (err) {
		done(err);
	}
});

passport.serializeUser((user, done) => done(null, user.id));

router
	.route("/callback")
	.get(
		passport.authenticate("github", {
			successRedirect: "/",
			failureRedirect: "/",
		})
	)
	.all(methodNotAllowed);

router
	.route("/login")
	.get(passport.authenticate("github"))
	.all(methodNotAllowed);

router
	.route("/principal")
	.get(authOnly, (req, res) => res.json(req.user))
	.all(methodNotAllowed);

export default router;
