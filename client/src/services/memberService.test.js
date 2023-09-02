import { rest } from "msw";

import { server } from "../../setupTests";

import MemberService from "./memberService";

describe("getUser", () => {
	const service = new MemberService();

	it("should handle correct Get request", async () => {
		const mockResponse = { id: "123", name: "John Doe" };
		server.use(
			rest.get("/api/users/123", (_, res, ctx) => {
				return res(ctx.status(200), ctx.json(mockResponse));
			})
		);

		const response = await service.getUserById(mockResponse.id);

		expect(response.data).toEqual(mockResponse);
		expect(response.error).toBeUndefined();
	});

	it("should handle server error Get request", async () => {
		server.use(
			rest.get("/api/users/123", (_, res, ctx) => {
				return res(ctx.status(503));
			})
		);

		const response = await service.getUserById("123");

		expect(response.data).toBeUndefined();
		expect(response.error).toBe("error with status 503");
	});

	it("should handle exception error Get request", async () => {
		const response = await service.getUserById("123");

		expect(response.data).toBeUndefined();
		expect(response.error).toBeDefined();
	});
});
