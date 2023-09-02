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

		describe("Get /:id", () => {
			it("gives a single user details", async () => {
				let { agent, user } = await authenticateAs("user");

				({ body: user } = await agent
					.get(`/api/users/${user.id}`)
					.set("User-Agent", "supertest")
					.expect(200));
			});

			it("gives error when user not found", async () => {
				let { agent } = await authenticateAs("user");

				await agent
					.get("/api/users/2b62c129-c735-4b8a-8bef-624bbcdbb0a9")
					.set("User-Agent", "supertest")
					.expect(404);
			});

			it("throws error when invalid ID", async () => {
				let { agent } = await authenticateAs("user");

				await agent
					.get("/api/users/invalid_user_ID")
					.set("User-Agent", "supertest")
					.expect(500);
			});
		});
	});

	describe("PATCH /:id", () => {
		it("is inaccessible to unauthenticated users", async () => {
			const { agent } = await authenticateAs("anonymous");
			await agent
				.patch("/api/users/abc123")
				.set("User-Agent", "supertest")
				.expect(401, "Unauthorized");
		});

		it("allows superusers to make other users admin", async () => {
			const { agent: anonAgent } = await authenticateAs("anonymous");
			let { agent, user } = await authenticateAs("user");
			expect(user.is_admin).toBe(false);

			await anonAgent
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
			const { agent } = await authenticateAs("anonymous");
			await agent
				.patch("/api/users/4174cd3c-70c9-4889-8acb-216de7f38025")
				.send({ is_admin: true })
				.set("Authorization", `Bearer ${sudoToken}`)
				.set("User-Agent", "supertest")
				.expect(404, "Not Found");
		});

		it("rejects other changes", async () => {
			const { agent } = await authenticateAs("anonymous");
			await agent
				.patch("/api/users/4174cd3c-70c9-4889-8acb-216de7f38025")
				.send({ name: "Some Alias" })
				.set("Authorization", `Bearer ${sudoToken}`)
				.set("User-Agent", "supertest")
				.expect(400, { name: '"name" is not allowed' });
		});
	});
});
