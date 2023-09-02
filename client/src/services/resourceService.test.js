import { randomUUID } from "node:crypto";

import { rest } from "msw";

import { resourceStub, server } from "../../setupTests";

import ResourceService from "./resourceService";

describe("ResourceService", () => {
	const service = new ResourceService();

	describe("getDrafts", () => {
		it("sends an appropriate GET request", async () => {
			let request;
			server.use(
				rest.get("/api/resources", (req, res, ctx) => {
					request = req;
					return res(ctx.json({ resources: [] }));
				})
			);
			await service.getDrafts();
			expect(request.url.searchParams.get("draft")).toBe("true");
		});

		it("returns resources on success", async () => {
			const resources = [true, true, true].map((draft) =>
				resourceStub({ draft })
			);
			server.use(
				rest.get("/api/resources", (req, res, ctx) => {
					return res(ctx.json({ resources }));
				})
			);

			await expect(service.getDrafts()).resolves.toHaveLength(3);
		});

		it("returns an empty array on error", async () => {
			server.use(
				rest.get("/api/resources", (req, res, ctx) => res(ctx.status(400)))
			);
			await expect(service.getDrafts()).resolves.toEqual([]);
		});
	});

	describe("getDrafById", () => {
		const resourceID = randomUUID();

		it("should return resource correctly", async () => {
			const mockResource = resourceStub({
				recommender: randomUUID(),
				id: resourceID,
				accession: "2023-09-02T08:19:30.771Z",
			});

			server.use(
				rest.get(`/api/resources/${resourceID}`, (_, res, ctx) => {
					return res(ctx.json(mockResource));
				})
			);

			const expectedResource = await service.getDraftById(resourceID);

			expect(expectedResource.data).toEqual(mockResource);
			expect(expectedResource.error).toBeUndefined();
		});

		it("should handle server error", async () => {
			server.use(
				rest.get(`/api/resources/${resourceID}`, (_, res, ctx) => {
					return res(ctx.status(503));
				})
			);

			const expectedResource = await service.getDraftById(resourceID);

			expect(expectedResource.data).toBeUndefined();
			expect(expectedResource.error).toBe("error with status 503");
		});

		it("should handle exception error", async () => {
			const response = await service.getDraftById("unknownID");

			expect(response.data).toBeUndefined();
			expect(response.error).toBeDefined();
		});
	});

	describe("getPublished", () => {
		it("includes query parameters if supplied", async () => {
			let request;
			server.use(
				rest.get("/api/resources", (req, res, ctx) => {
					request = req;
					return res(ctx.json({ resources: [] }));
				})
			);
			await service.getPublished({ page: 123, perPage: 456 });
			expect(request.url.searchParams.get("page")).toBe("123");
			expect(request.url.searchParams.get("perPage")).toBe("456");
		});

		it("resolves with resources if request succeeds", async () => {
			const resources = [
				resourceStub({ title: "My Resource", url: "https://example.com" }),
			];
			server.use(
				rest.get("/api/resources", (req, res, ctx) =>
					res(ctx.json({ resources }))
				)
			);
			await expect(service.getPublished()).resolves.toEqual({ resources });
		});

		it("resolves with undefined if request fails", async () => {
			server.use(
				rest.get("/api/resources", (req, res, ctx) => res(ctx.status(500)))
			);
			await expect(service.getPublished()).resolves.toBeUndefined();
		});
	});

	describe("publish", () => {
		it("sends an appropriate PATCH request", async () => {
			let request;
			const id = "abc123";
			server.use(
				rest.patch("/api/resources/:id", async (req, res, ctx) => {
					request = req;
					return res(ctx.json({ draft: false }));
				})
			);
			await service.publish(id);
			expect(request.params.id).toBe(id);
			await expect(request.json()).resolves.toEqual({ draft: false });
		});
	});

	describe("suggest", () => {
		it("returns the resource on success", async () => {
			let request;
			const submitted = { title: "foo bar", url: "https://example.com" };
			const created = resourceStub({
				...submitted,
				draft: true,
			});
			server.use(
				rest.post("/api/resources", async (req, res, ctx) => {
					request = req;
					return res(ctx.status(201), ctx.json(created));
				})
			);
			await expect(service.suggest(submitted)).resolves.toEqual(created);
			await expect(request.json()).resolves.toEqual(submitted);
		});

		it("throws a useful error on conflict", async () => {
			server.use(
				rest.post("/api/resources", (req, res, ctx) => {
					return res(ctx.status(409));
				})
			);
			await expect(service.suggest({})).rejects.toThrow(
				"a very similar resource already exists"
			);
		});

		it("throws a useful error otherwise", async () => {
			server.use(
				rest.post("/api/resources", (req, res, ctx) => {
					return res(ctx.status(401));
				})
			);
			await expect(service.suggest({})).rejects.toThrow("something went wrong");
		});
	});
});
