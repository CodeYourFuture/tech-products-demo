import { authenticateAs } from "../setupTests";

describe("/auth", () => {
	describe("GET /principal", () => {
		it("returns the authenticated user", async () => {
			const { agent, user } = await authenticateAs("user");

			const { body: principal } = await agent
				.get("/api/auth/principal")
				.set("User-Agent", "supertest")
				.expect(200);

			expect(principal).toEqual(user);
		});

		it("returns 401 for unauthenticated user", async () => {
			const { agent } = await authenticateAs("anonymous");
			await agent
				.get("/api/auth/principal")
				.set("User-Agent", "supertest")
				.expect(401);
		});
	});
});
