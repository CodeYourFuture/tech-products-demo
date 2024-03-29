import "dotenv-expand/config";
import { http, HttpResponse } from "msw";
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

const uniqueIds = new Set([0]);

const generateUniqueId = () => {
	const id = Math.max(...uniqueIds) + 1;
	uniqueIds.add(id);
	return id;
};

/**
 * Creates a SuperTest-wrapped {@link https://ladjs.github.io/superagent/#agents-for-global-state agent}
 * to use in the tests, and returns it along with the user (if appropriate).
 * - `"anonymous"`: basic agent, no cookies
 * - `"user"`: logged in as non-admin user
 * - `"admin"`: logged in as admin user
 * @param {"anonymous" | "user" | "admin"} identity
 * @returns {Promise<{
 *   agent: import("supertest").SuperTest<import("supertest").Test>,
 *   user?: { email: string, github_id: number, id: string, is_admin: boolean, name: string },
 * }>}
 */
export const authenticateAs = async (identity) => {
	const agent = request.agent(app);
	if (identity === "anonymous") {
		return { agent };
	}
	server.use(
		http.post(
			config.oauth.tokenURL ?? "https://github.com/login/oauth/access_token",
			() =>
				HttpResponse.json({
					access_token: "my-cool-token",
					scope: "read:user,user:email",
					token_type: "bearer",
				})
		),
		http.get(config.oauth.userProfileURL ?? "https://api.github.com/user", () =>
			HttpResponse.json({
				id: generateUniqueId(),
				login: identity,
				name: "Sushma Moolya",
			})
		),
		http.get(
			config.oauth.userEmailURL ?? "https://api.github.com/user/emails",
			() =>
				HttpResponse.json([
					{
						email: "user@example.com",
						primary: true,
						verified: true,
						visibility: "public",
					},
				])
		)
	);
	await agent
		.get("/api/auth/callback")
		.query({ code: "my-cool-code" })
		.set("User-Agent", "supertest")
		.expect(302)
		.expect("Location", "/");
	let { body: user } = await agent
		.get("/api/auth/principal")
		.set("User-Agent", "supertest")
		.expect(200);
	if (identity === "admin") {
		({ body: user } = await agent
			.patch(`/api/users/${user.id}`)
			.set("Authorization", `Bearer ${sudoToken}`)
			.set("User-Agent", "supertest")
			.expect(200));
	}
	return { agent, user };
};
