import request from "supertest";

import app from "../app";
import { authenticateAs, sudoToken } from "../setupTests";

describe("/api/users", () => {
	describe("GET /", () => {
		it("is inaccessible to unauthenticated users", async () => {
			await request(app)
				.get("/api/users")
				.set("User-Agent", "supertest")
				.expect(401, "Unauthorized");
		});

		it("gives a superuser the list of users", async () => {
			const agent = await authenticateAs(
				{ id: 123, login: "foo" },
				"foo@example.com"
			);
			const { body: user } = await agent
				.get("/api/auth/principal")
				.set("User-Agent", "supertest")
				.expect(200);

			await request(app)
				.get("/api/users")
				.set("Authorization", `Bearer ${sudoToken}`)
				.set("User-Agent", "supertest")
				.expect(200, [user]);
		});
	});

	describe("PATCH /:id", () => {
		it("is inaccessible to unauthenticated users", async () => {
			await request(app)
				.patch("/api/users/abc123")
				.set("User-Agent", "supertest")
				.expect(401, "Unauthorized");
		});

		it("allows superusers to make other users admin", async () => {
			const agent = await authenticateAs(
				{ id: 123, login: "foo" },
				"foo@example.com"
			);
			let { body: user } = await agent
				.get("/api/auth/principal")
				.set("User-Agent", "supertest")
				.expect(200);
			expect(user.is_admin).toBe(false);

			await request(app)
				.patch(`/api/users/${user.id}`)
				.send({ is_admin: true })
				.set("Authorization", `Bearer ${sudoToken}`)
				.set("User-Agent", "supertest")
				.expect(200, { ...user, is_admin: true });

			({ body: user } = await agent
				.get("/api/auth/principal")
				.set("User-Agent", "supertest")
				.expect(200));
			expect(user.is_admin).toBe(true);
		});

		it("rejects updates to nonexistent users", async () => {
			await request(app)
				.patch("/api/users/4174cd3c-70c9-4889-8acb-216de7f38025")
				.send({ is_admin: true })
				.set("Authorization", `Bearer ${sudoToken}`)
				.set("User-Agent", "supertest")
				.expect(404, "Not Found");
		});

		it("rejects other changes", async () => {
			await request(app)
				.patch("/api/users/4174cd3c-70c9-4889-8acb-216de7f38025")
				.send({ name: "Some Alias" })
				.set("Authorization", `Bearer ${sudoToken}`)
				.set("User-Agent", "supertest")
				.expect(400, { name: '"name" is not allowed' });
		});
	});
});
