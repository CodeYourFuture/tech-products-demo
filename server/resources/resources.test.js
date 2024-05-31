import { randomUUID } from "node:crypto";

import { authenticateAs, patterns, sudoToken } from "../setupTests";

describe("/api/resources", () => {
	describe("POST /", () => {
		it("returns the created resource", async () => {
			const {
				agent,
				user: { id },
			} = await authenticateAs("user");
			const resource = {
				title: "CYF Syllabus",
				url: "https://syllabus.codeyourfuture.io/",
			};

			const { body } = await agent
				.post("/api/resources")
				.send(resource)
				.set("User-Agent", "supertest")
				.expect(201);

			expect(body).toMatchObject({
				accession: expect.stringMatching(patterns.DATETIME),
				description: null,
				status: "drafted",
				id: expect.stringMatching(patterns.UUID),
				source: id,
				title: resource.title,
				url: resource.url,
			});
		});

		it("accepts a description", async () => {
			const { agent } = await authenticateAs("user");
			const resource = {
				description: "Helpful tool for PostgreSQL DB migrations.",
				title: "Node PG Migrate",
				url: "https://salsita.github.io/node-pg-migrate/#/",
			};

			const { body } = await agent
				.post("/api/resources")
				.send(resource)
				.set("User-Agent", "supertest")
				.expect(201);

			expect(body).toMatchObject(resource);
		});

		it("allows a topic", async () => {
			const { agent } = await authenticateAs("user");
			const { body: topics } = await agent
				.get("/api/topics")
				.set("User-Agent", "supertest")
				.expect(200);
			const topic = topics.find(({ name }) => name === "React");

			const { body: created } = await agent
				.post("/api/resources")
				.send({
					title: "Something",
					topic: topic.id,
					url: "https://example.com",
				})
				.set("User-Agent", "supertest")
				.expect(201);

			expect(created).toHaveProperty("topic", topic.id);
		});

		it("rejects unknown topics", async () => {
			const { agent } = await authenticateAs("user");
			await agent
				.post("/api/resources")
				.send({
					title: "Something",
					topic: randomUUID(),
					url: "https://example.com",
				})
				.set("User-Agent", "supertest")
				.expect(400, { topic: '"topic" must exist' });
		});

		it("rejects unauthenticated users", async () => {
			const { agent } = await authenticateAs("anonymous");
			await agent
				.post("/api/resources")
				.send({ title: "Something", url: "https://example.com" })
				.set("User-Agent", "supertest")
				.expect(401, "Unauthorized");
		});

		[
			{
				req: {},
				res: { title: '"title" is required', url: '"url" is required' },
				title: "everything missing",
			},
			{
				req: { url: "https://example.com" },
				res: { title: '"title" is required' },
				title: "missing title",
			},
			{
				req: { title: "foo" },
				res: { url: '"url" is required' },
				title: "missing url",
			},
			{
				req: { title: "foo", url: "/foo/bar" },
				res: { url: '"url" must be a valid uri' },
				title: "invalid url",
			},
		].forEach(({ req, res, title }) => {
			it(`rejects invalid request: ${title}`, async () => {
				const { agent } = await authenticateAs("user");
				await agent
					.post("/api/resources")
					.send(req)
					.set("User-Agent", "supertest")
					.expect(400, res);
			});
		});

		it("rejects duplicate resources", async () => {
			const { agent } = await authenticateAs("user");
			const title = "Wuthering Heights";
			const url = "https://example.com";
			await agent
				.post("/api/resources")
				.send({ title, url })
				.set("User-Agent", "supertest")
				.expect(201);
			await agent
				.post("/api/resources")
				.send({ title: "Other", url })
				.set("User-Agent", "supertest")
				.expect(409, "Conflict");
		});
	});

	describe("GET /", () => {
		describe("pagination", () => {
			beforeEach(async () => {
				const { agent: userAgent } = await authenticateAs("user");
				for (let index = 0; index < 25; index++) {
					await userAgent
						.post("/api/resources")
						.send({
							title: `Resource ${index}`,
							url: `https://example.com/${index}`,
						})
						.set("User-Agent", "supertest")
						.expect(201);
				}
			});

			it("returns the first page of 20 by default", async () => {
				const { agent: adminAgent } = await authenticateAs("admin");
				const { body: envelope } = await adminAgent
					.get("/api/resources")
					.query({ status: "drafted" })
					.set("User-Agent", "supertest")
					.expect(200);
				expect(envelope).toEqual({
					page: 1,
					lastPage: 2,
					perPage: 20,
					resources: expect.any(Array),
					totalCount: 25,
				});
				expect(envelope.resources).toHaveLength(20);
				expect(envelope.resources[0]).toMatchObject({ title: "Resource 24" });
				expect(envelope.resources[19]).toMatchObject({ title: "Resource 5" });
			});

			it("lets subsequent pages be selected", async () => {
				const { agent: adminAgent } = await authenticateAs("admin");
				const { body: envelope } = await adminAgent
					.get("/api/resources")
					.query({ status: "drafted", page: 2, perPage: 10 })
					.set("User-Agent", "supertest")
					.expect(200);
				expect(envelope).toEqual({
					page: 2,
					lastPage: 3,
					perPage: 10,
					resources: expect.any(Array),
					totalCount: 25,
				});
				expect(envelope.resources).toHaveLength(10);
				expect(envelope.resources[0]).toMatchObject({ title: "Resource 14" });
				expect(envelope.resources[9]).toMatchObject({ title: "Resource 5" });
			});

			it("rejects bad inputs", async () => {
				const { agent } = await authenticateAs("admin");
				await agent
					.get("/api/resources")
					.query({ status: "drafted", page: 0, perPage: "foo" })
					.set("User-Agent", "supertest")
					.expect(400, {
						page: '"page" must be greater than or equal to 1',
						perPage: '"perPage" must be a number',
					});
			});
		});

		it("allows superuser to see draft resources", async () => {
			const { agent: anonAgent } = await authenticateAs("anonymous");
			const { agent } = await authenticateAs("user");
			const resource = { title: "foo", url: "https://example.com" };
			await agent
				.post("/api/resources")
				.send(resource)
				.set("User-Agent", "supertest")
				.expect(201);

			const {
				body: { resources },
			} = await anonAgent
				.get("/api/resources")
				.query({ status: "drafted" })
				.set("Authorization", `Bearer ${sudoToken}`)
				.set("User-Agent", "supertest")
				.expect(200);

			expect(resources).toHaveLength(1);
			expect(resources[0]).toMatchObject(resource);
		});

		it("prevents non-superusers from seeing draft resources", async () => {
			const { agent: anonAgent } = await authenticateAs("anonymous");
			const { agent } = await authenticateAs("user");
			const resource = { title: "title", url: "https://example.com" };
			await agent
				.post("/api/resources")
				.send(resource)
				.set("User-Agent", "supertest")
				.expect(201);

			await anonAgent
				.get("/api/resources")
				.query({ status: "drafted" })
				.set("User-Agent", "supertest")
				.expect(403, "Forbidden");
		});

		it("includes the topic name if present", async () => {
			const { agent: anonAgent } = await authenticateAs("anonymous");
			const { agent } = await authenticateAs("user");
			const {
				body: [topic],
			} = await agent
				.get("/api/topics")
				.set("User-Agent", "supertest")
				.expect(200);

			await agent
				.post("/api/resources")
				.send({
					title: "Irrelevant",
					topic: topic.id,
					url: "https://example.com",
				})
				.set("User-Agent", "supertest")
				.expect(201);

			const {
				body: {
					resources: [status],
				},
			} = await anonAgent
				.get("/api/resources")
				.query({ status: "drafted" })
				.set("Authorization", `Bearer ${sudoToken}`)
				.set("User-Agent", "supertest")
				.expect(200);
			expect(status).toHaveProperty("topic_name", topic.name);
		});
	});

	describe("PATCH /:id", () => {
		it("allows superusers to publish a draft resource", async () => {
			const { agent: anonAgent } = await authenticateAs("anonymous");
			const { agent } = await authenticateAs("user");
			const { body: resource } = await agent
				.post("/api/resources")
				.send({
					title: "CYF Syllabus",
					url: "https://syllabus.codeyourfuture.io/",
				})
				.set("User-Agent", "supertest")
				.expect(201);

			const { body: updated } = await anonAgent
				.patch(`/api/resources/${resource.id}`)
				.send({ status: "published" })
				.set("Authorization", `Bearer ${sudoToken}`)
				.set("User-Agent", "supertest")
				.expect(200);

			expect(updated).toEqual({
				...resource,
				status: "published",
				status_changed_date: expect.stringMatching(patterns.DATETIME),
				status_changed_by: null,
			});

			const {
				body: { resources },
			} = await anonAgent.get("/api/resources").set("User-Agent", "supertest");
			expect(resources).toHaveLength(1);
		});

		it("rejects other changes", async () => {
			const { agent: anonAgent } = await authenticateAs("anonymous");
			const { agent } = await authenticateAs("user");
			const { body: resource } = await agent
				.post("/api/resources")
				.send({
					title: "Mastering margin collapsing",
					url: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Box_Model/Mastering_margin_collapsing",
				})
				.set("User-Agent", "supertest")
				.expect(201);

			await anonAgent
				.patch(`/api/resources/${resource.id}`)
				.send({ status: "drafted", title: "Something else" })
				.set("Authorization", `Bearer ${sudoToken}`)
				.set("User-Agent", "supertest")
				.expect(400, {
					status: '"status" must be one of [rejected, published]',
					title: '"title" is not allowed',
				});
		});

		it("handles missing resources", async () => {
			const { agent } = await authenticateAs("anonymous");
			await agent
				.patch(`/api/resources/${randomUUID()}`)
				.send({ status: "published" })
				.set("Authorization", `Bearer ${sudoToken}`)
				.set("User-Agent", "supertest")
				.expect(404);
		});

		it("prevents non-superusers from publishing resources", async () => {
			const { agent: anonAgent } = await authenticateAs("anonymous");
			const { agent } = await authenticateAs("user");
			const { body: resource } = await agent
				.post("/api/resources")
				.send({
					title: "PostgreSQL tutorial",
					url: "https://www.postgresqltutorial.com/",
				})
				.set("User-Agent", "supertest")
				.expect(201);

			await anonAgent
				.patch(`/api/resources/${resource.id}`)
				.send({ status: "published" })
				.set("User-Agent", "supertest")
				.expect(401);
		});

		it("records who published the resource", async () => {
			const { agent: adminAgent, user: admin } = await authenticateAs("admin");
			const { agent: userAgent, user } = await authenticateAs("user");

			const { body: created } = await userAgent
				.post("/api/resources")
				.send({ title: "Example", url: "https://example.com" })
				.set("User-Agent", "supertest")
				.expect(201);

			const { body: published } = await adminAgent
				.patch(`/api/resources/${created.id}`)
				.send({ status: "published" })
				.set("User-Agent", "supertest")
				.expect(200);

			expect(published).toMatchObject({
				status_changed_by: admin.id,
				source: user.id,
			});
		});
	});
});
