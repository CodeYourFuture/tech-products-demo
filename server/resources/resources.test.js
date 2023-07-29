import { randomUUID } from "node:crypto";

import request from "supertest";

import app from "../app";
import { authenticateAs, patterns, sudoToken } from "../setupTests";

describe("/api/resources", () => {
	describe("POST /", () => {
		it("returns the created resource", async () => {
			const agent = await authenticateAs(
				{ id: 123, login: "foo-bar" },
				"foo@bar.org"
			);
			const resource = {
				title: "CYF Syllabus",
				url: "https://syllabus.codeyourfuture.io/",
			};

			const {
				body: { id },
			} = await agent
				.get("/api/auth/principal")
				.set("User-Agent", "supertest")
				.expect(200);
			const { body } = await agent
				.post("/api/resources")
				.send(resource)
				.set("User-Agent", "supertest")
				.expect(201);

			expect(body).toMatchObject({
				accession: expect.stringMatching(patterns.DATETIME),
				description: null,
				draft: true,
				id: expect.stringMatching(patterns.UUID),
				source: id,
				title: resource.title,
				url: resource.url,
			});
		});

		it("accepts a description", async () => {
			const agent = await authenticateAs(
				{ id: 123, login: "foo-bar" },
				"foo@bar.org"
			);
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

		it("rejects unauthenticated users", async () => {
			await request(app)
				.post("/api/resources")
				.send({ title: "Something", url: "https://example.com" })
				.set("User-Agent", "supertest")
				.expect(401, "Unauthorized");
		});
	});

	describe("GET /", () => {
		it("allows superuser to see all resources", async () => {
			const agent = await authenticateAs({ id: 123, login: "" }, "");
			const resource = { title: "foo", url: "bar" };
			await agent
				.post("/api/resources")
				.send(resource)
				.set("User-Agent", "supertest")
				.expect(201);

			const { body } = await request(app)
				.get("/api/resources")
				.query({ drafts: true })
				.set("Authorization", `Bearer ${sudoToken}`)
				.set("User-Agent", "supertest")
				.expect(200);

			expect(body).toHaveLength(1);
			expect(body[0]).toMatchObject(resource);
		});

		it("prevents non-superusers from seeing draft resources", async () => {
			const agent = await authenticateAs({ id: 123, login: "" }, "");
			const resource = { title: "title", url: "url" };
			await agent
				.post("/api/resources")
				.send(resource)
				.set("User-Agent", "supertest")
				.expect(201);

			await request(app)
				.get("/api/resources")
				.query({ drafts: true })
				.set("User-Agent", "supertest")
				.expect(200, []);
		});
	});

	describe("PATCH /:id", () => {
		it("allows superusers to publish a draft resource", async () => {
			const agent = await authenticateAs({ id: 123, login: "" }, "");
			const { body: resource } = await agent
				.post("/api/resources")
				.send({
					title: "CYF Syllabus",
					url: "https://syllabus.codeyourfuture.io/",
				})
				.set("User-Agent", "supertest")
				.expect(201);

			const { body: updated } = await request(app)
				.patch(`/api/resources/${resource.id}`)
				.send({ draft: false })
				.set("Authorization", `Bearer ${sudoToken}`)
				.set("User-Agent", "supertest")
				.expect(200);

			expect(updated).toEqual({
				...resource,
				draft: false,
				publication: expect.stringMatching(patterns.DATETIME),
			});

			const { body: resources } = await request(app)
				.get("/api/resources")
				.set("User-Agent", "supertest");
			expect(resources).toHaveLength(1);
		});

		it("rejects other changes", async () => {
			const agent = await authenticateAs({ id: 123, login: "" }, "");
			const { body: resource } = await agent
				.post("/api/resources")
				.send({
					title: "Mastering margin collapsing",
					url: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Box_Model/Mastering_margin_collapsing",
				})
				.set("User-Agent", "supertest")
				.expect(201);

			await request(app)
				.patch(`/api/resources/${resource.id}`)
				.send({ draft: true, title: "Something else" })
				.set("Authorization", `Bearer ${sudoToken}`)
				.set("User-Agent", "supertest")
				.expect(400);
		});

		it("handles missing resources", async () => {
			await request(app)
				.patch(`/api/resources/${randomUUID()}`)
				.send({ draft: false })
				.set("Authorization", `Bearer ${sudoToken}`)
				.set("User-Agent", "supertest")
				.expect(404);
		});

		it("prevents non-superusers from publishing resources", async () => {
			const agent = await authenticateAs({ id: 123, login: "" }, "");
			const { body: resource } = await agent
				.post("/api/resources")
				.send({
					title: "PostgreSQL tutorial",
					url: "https://www.postgresqltutorial.com/",
				})
				.set("User-Agent", "supertest")
				.expect(201);

			await request(app)
				.patch(`/api/resources/${resource.id}`)
				.send({ draft: false })
				.set("User-Agent", "supertest")
				.expect(401);
		});
	});
});
