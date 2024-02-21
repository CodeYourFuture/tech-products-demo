import { randomUUID } from "node:crypto";

import { rest } from "msw";

import { server } from "../../setupTests";

import TopicService from "./topicService";

describe("TopicService", () => {
	const service = new TopicService();

	it("resolves with the data if the request succeeds", async () => {
		const topics = [{ id: randomUUID(), name: "My Topic" }];
		server.use(
			rest.get("/api/topics", (req, res, ctx) => res(ctx.json(topics)))
		);
		await expect(service.getTopics()).resolves.toEqual(topics);
	});

	it("resolves undefined if the request fails", async () => {
		server.use(
			rest.get("/api/topics", (req, res, ctx) => res(ctx.status(500)))
		);
		const topics = await service.getTopics();
		expect(topics).toEqual([]);
	});
});
