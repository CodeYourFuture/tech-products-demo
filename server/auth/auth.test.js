import request from "supertest";

import app from "../app";
import { authenticateAs, patterns } from "../setupTests";

describe("/auth", () => {
	describe("GET /principal", () => {
		it("returns the authenticated user", async () => {
			const email = "user@example.com";
			const user = { id: 123, login: "user", name: "Some User" };
			const agent = await authenticateAs(user, email);

			const { body: principal } = await agent
				.get("/api/auth/principal")
				.set("User-Agent", "supertest")
				.expect(200);

			expect(principal).toEqual({
				email,
				github_id: user.id,
				id: expect.stringMatching(patterns.UUID),
				name: user.name,
			});
		});

		it("returns 401 for unauthenticated user", async () => {
			await request(app)
				.get("/api/auth/principal")
				.set("User-Agent", "supertest")
				.expect(401);
		});
	});
});
