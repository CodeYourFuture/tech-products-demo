import { randomUUID } from "node:crypto";

import "@testing-library/jest-dom";
import "whatwg-fetch";
import { rest } from "msw";
import { setupServer } from "msw/node";
export const resourceStub = (overrides = {}) => ({
	accession: new Date(),
	description: null,
	draft: false,
	id: randomUUID(),
	publication: null,
	publisher: null,
	source: randomUUID(),
	title: "",
	topic: null,
	topic_name: null,
	url: "https://example.com",
	...overrides,
});

export const server = setupServer();

beforeAll(() =>
	server.listen({
		onUnhandledRequest({ method, url }) {
			throw new Error(`unhandled ${method} request to ${url}`);
		},
	})
);

server.use(
	rest.get("/api/topics", (req, res, ctx) => {
		const mockTopics = [
			{ id: randomUUID(), name: "Topic 1" },
			{ id: randomUUID(), name: "Topic 2" },
		];

		return res(ctx.json(mockTopics));
	})
);

afterEach(() => server.resetHandlers());

afterAll(() => server.close());
