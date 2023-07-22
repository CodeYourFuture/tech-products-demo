import "@testing-library/jest-dom/extend-expect";
import "whatwg-fetch";
import { setupServer } from "msw/node";

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
