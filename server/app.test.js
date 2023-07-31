import { authenticateAs } from "./setupTests";

describe("app", () => {
	it("exposes a /health endpoint", async () => {
		const { agent } = await authenticateAs("anonymous");
		await agent.get("/health").set("User-Agent", "supertest").expect(200, "OK");
	});

	it("serves resources from the static directory", async () => {
		const { agent } = await authenticateAs("anonymous");
		await agent
			.get("/")
			.set("User-Agent", "supertest")
			.expect("Content-Type", /^text\/html/)
			.expect(200, /For testing purposes only!/);
		await agent
			.get("/main.js")
			.set("User-Agent", "supertest")
			.expect("Content-Type", /^application\/javascript/)
			.expect(200, /Some JavaScript file/);
	});

	it("handles push-state routing on GET only", async () => {
		const { agent } = await authenticateAs("anonymous");
		await agent
			.get("/foobar")
			.set("User-Agent", "supertest")
			.expect("Content-Type", /^text\/html/)
			.expect(200, /For testing purposes only!/);
		await agent.post("/foobar").set("User-Agent", "supertest").expect(404);
	});
});
