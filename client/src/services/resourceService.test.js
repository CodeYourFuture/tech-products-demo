import { rest } from "msw";

import { server } from "../../setupTests";

import ResourceService from "./resourceService";

describe("ResourceService", () => {
	const service = new ResourceService();

	describe("getDrafts", () => {
		it("sends an appropriate GET request", async () => {
			expect.assertions(1);
			server.use(
				rest.get("/api/resources", (req, res, ctx) => {
					expect(req.url.searchParams.get("drafts")).toBe("true");
					return res(ctx.json([]));
				})
			);
			await service.getDrafts();
		});

		it("filters published resources out of the returned payload", async () => {
			const resources = [{ draft: true }, { draft: false }, { draft: true }];
			server.use(
				rest.get("/api/resources", (req, res, ctx) => {
					return res(ctx.json(resources));
				})
			);

			await expect(service.getDrafts()).resolves.toHaveLength(2);
		});

		it("returns an empty array on error", async () => {
			server.use(
				rest.get("/api/resources", (req, res, ctx) => res(ctx.status(400)))
			);
			await expect(service.getDrafts()).resolves.toEqual([]);
		});
	});

	describe("publish", () => {
		it("sends an appropriate PATCH request", async () => {
			expect.assertions(2);
			const id = "abc123";
			server.use(
				rest.patch("/api/resources/:id", async (req, res, ctx) => {
					expect(req.params.id).toBe(id);
					await expect(req.json()).resolves.toEqual({ draft: false });
					return res(ctx.json({ draft: false }));
				})
			);
			await service.publish(id);
		});
	});
});
