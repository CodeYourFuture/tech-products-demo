import { Router } from "express";
import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";

import config from "../utils/config";
import { authOnly } from "../utils/middleware";

import * as service from "./authService";

const router = Router();
passport.use(
	"github",
	new GitHubStrategy(
		{ ...config.oauth },
		async (accessToken, refreshToken, profile, done) => {
			try {
				done(null, await service.logIn(profile));
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

router.get(
	"/callback",
	passport.authenticate("github", {
		successRedirect: "/",
		failureRedirect: "/",
	})
);

router.get(
	"/login",
	passport.authenticate("github", { scope: ["user:email"] })
);

router.get("/principal", authOnly, (req, res) => res.json(req.user));

export default router;
