import { randomUUID } from "node:crypto";

import { http, HttpResponse } from "msw";

import { server } from "../../setupTests";

import TopicService from "./topicService";

describe("TopicService", () => {
	const service = new TopicService();

	it("resolves with the data if the request succeeds", async () => {
		const topics = [{ id: randomUUID(), name: "My Topic" }];
		server.use(http.get("/api/topics", () => HttpResponse.json(topics)));
		await expect(service.getTopics()).resolves.toEqual(topics);
	});

	it("resolves undefined if the request fails", async () => {
		server.use(
			http.get(
				"/api/topics",
				() => new Response("Internal Server Error", { status: 500 })
			)
		);
		await expect(service.getTopics()).resolves.toBeUndefined();
	});
});
