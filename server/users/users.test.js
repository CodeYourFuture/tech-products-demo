import { authenticateAs, sudoToken } from "../setupTests";

describe("/api/users", () => {
	describe("GET /", () => {
		it("is inaccessible to unauthenticated users", async () => {
			const { agent } = await authenticateAs("anonymous");
			await agent
				.get("/api/users")
				.set("User-Agent", "supertest")
				.expect(401, "Unauthorized");
		});

		it("gives a superuser the list of users", async () => {
			const { agent } = await authenticateAs("anonymous");
			const { user } = await authenticateAs("user");

			await agent
				.get("/api/users")
				.set("Authorization", `Bearer ${sudoToken}`)
				.set("User-Agent", "supertest")
				.expect(200, [user]);
		});
	});

	describe("PATCH /:id", () => {
		it("is inaccessible to unauthenticated users", async () => {
			const { agent } = await authenticateAs("anonymous");
			await agent
				.patch("/api/users/abc123")
				.set("Content-Type", "application/json-patch+json")
				.set("User-Agent", "supertest")
				.expect(401, "Unauthorized");
		});

		it("allows superusers to make other users admin", async () => {
			const { agent: anonAgent } = await authenticateAs("anonymous");
			let { agent, user } = await authenticateAs("user");
			expect(user.is_admin).toBe(false);

			await anonAgent
				.patch(`/api/users/${user.id}`)
				.send([{ op: "replace", path: "/is_admin", value: true }])
				.set("Authorization", `Bearer ${sudoToken}`)
				.set("Content-Type", "application/json-patch+json")
				.set("User-Agent", "supertest")
				.expect(200, { ...user, is_admin: true });

			({ body: user } = await agent
				.get("/api/auth/principal")
				.set("User-Agent", "supertest")
				.expect(200));
			expect(user.is_admin).toBe(true);
		});

		it("rejects updates to nonexistent users", async () => {
			const { agent } = await authenticateAs("anonymous");
			await agent
				.patch("/api/users/4174cd3c-70c9-4889-8acb-216de7f38025")
				.send([{ op: "replace", path: "/is_admin", value: true }])
				.set("Authorization", `Bearer ${sudoToken}`)
				.set("Content-Type", "application/json-patch+json")
				.set("User-Agent", "supertest")
				.expect(404, "Not Found");
		});

		it("rejects other changes", async () => {
			let { user } = await authenticateAs("user");
			const { agent: anonAgent } = await authenticateAs("anonymous");
			await anonAgent
				.patch(`/api/users/${user.id}`)
				.send([{ op: "replace", path: "/name", value: "Some Alias" }])
				.set("Authorization", `Bearer ${sudoToken}`)
				.set("Content-Type", "application/json-patch+json")
				.set("User-Agent", "supertest")
				.expect(422, {
					details: "Only changing the admin status to true is supported",
					error: "Unprocessable Content",
				});
		});

		it("rejects non-JSONPatch requests", async () => {
			let { user } = await authenticateAs("user");
			const { agent: anonAgent } = await authenticateAs("anonymous");
			await anonAgent
				.patch(`/api/users/${user.id}`)
				.send({ name: "Some Alias" })
				.set("Authorization", `Bearer ${sudoToken}`)
				.set("Content-Type", "application/json-patch+json")
				.set("User-Agent", "supertest")
				.expect(400, { undefined: '"value" must be an array' });
		});
	});
});
