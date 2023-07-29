import "dotenv-expand/config";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { Pool } from "pg";
import format from "pg-format";
import request from "supertest";

import app from "./app";
import { disconnectDb } from "./db";
import config from "./utils/config";

const pool = new Pool({ connectionString: config.dbUrl });

export const patterns = {
	DATETIME: /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/,
	UUID: /[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}/,
};
export const server = setupServer();
export const { sudoToken } = config;

beforeAll(() => {
	server.listen({
		onUnhandledRequest({ headers, method, url }) {
			if (headers.get("User-Agent") !== "supertest") {
				throw new Error(`unhandled ${method} request to ${url}`);
			}
		},
	});
});

beforeEach(async () => {
	for (const table of ["resources", "users"]) {
		await pool.query(format("TRUNCATE TABLE %I CASCADE;", table));
	}
	server.resetHandlers();
});

afterAll(async () => {
	await server.close();
	await pool.end();
	await disconnectDb();
});

/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} login
 * @property {string=} name
 *
 * @param {User} user
 * @param {string} email
 * @returns {Promise<import("supertest").TestAgent>}
 */
export const authenticateAs = async (user, email) => {
	const agent = request.agent(app);
	server.use(
		rest.post(
			config.oauth.tokenURL ?? "https://github.com/login/oauth/access_token",
			(req, res, ctx) => {
				return res(
					ctx.json({
						access_token: "my-cool-token",
						scope: "read:user,user:email",
						token_type: "bearer",
					})
				);
			}
		),
		rest.get(
			config.oauth.userProfileURL ?? "https://api.github.com/user",
			(req, res, ctx) => {
				return res(ctx.json(user));
			}
		),
		rest.get(
			config.oauth.userEmailURL ?? "https://api.github.com/user/emails",
			(req, res, ctx) => {
				return res(
					ctx.json([
						{ email, primary: true, verified: true, visibility: "public" },
					])
				);
			}
		)
	);
	await agent
		.get("/api/auth/callback")
		.query({ code: "my-cool-code" })
		.set("User-Agent", "supertest")
		.expect(302)
		.expect("Location", "/");
	return agent;
};
