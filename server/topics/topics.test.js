import { authenticateAs, patterns } from "../setupTests";

describe("/api/topics", () => {
	describe("GET /", () => {
		it("exposes the list of topics", async () => {
			const { agent } = await authenticateAs("anonymous");
			const { body: topics } = await agent
				.get("/api/topics")
				.set("User-Agent", "supertest")
				.expect(200);
			[
				"Git",
				"HTML/CSS",
				"JavaScript",
				"Node & Express",
				"Professional Development",
				"React",
				"SQL & Postgres",
			].forEach((name) =>
				expect(topics).toContainEqual({
					name,
					id: expect.stringMatching(patterns.UUID),
				})
			);
		});
	});
});
