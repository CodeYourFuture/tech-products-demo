import { randomUUID } from "node:crypto";

import "@testing-library/jest-dom/extend-expect";
import "whatwg-fetch";
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

afterEach(() => server.resetHandlers());

afterAll(() => server.close());
