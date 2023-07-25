import request from "supertest";

import app from "./app";

describe("app", () => {
	it("exposes a /health endpoint", async () => {
		await request(app)
			.get("/health")
			.set("User-Agent", "supertest")
			.expect(200, "OK");
	});

	it("serves resources from the static directory", async () => {
		await request(app)
			.get("/")
			.set("User-Agent", "supertest")
			.expect("Content-Type", /^text\/html/)
			.expect(200, /For testing purposes only!/);
		await request(app)
			.get("/main.js")
			.set("User-Agent", "supertest")
			.expect("Content-Type", /^application\/javascript/)
			.expect(200, /Some JavaScript file/);
	});

	it("handles push-state routing on GET only", async () => {
		await request(app)
			.get("/foobar")
			.set("User-Agent", "supertest")
			.expect("Content-Type", /^text\/html/)
			.expect(200, /For testing purposes only!/);
		await request(app)
			.post("/foobar")
			.set("User-Agent", "supertest")
			.expect(404);
	});
});
