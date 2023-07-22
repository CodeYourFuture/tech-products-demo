import { randomUUID } from "node:crypto";

import { Pool } from "pg";
import request from "supertest";

import app from "../app";

const DATETIME = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/;
const UUID = /[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}/;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

describe("/api/resources", () => {
	beforeEach(async () => {
		await pool.query("TRUNCATE TABLE resources;");
	});

	afterAll(() => pool.end());

	describe("POST /", () => {
		it("returns the created resource", async () => {
			const resource = {
				title: "CYF Syllabus",
				url: "https://syllabus.codeyourfuture.io/",
			};

			const { body } = await request(app)
				.post("/api/resources")
				.send(resource)
				.expect(201);

			expect(body).toMatchObject({
				accession: expect.stringMatching(DATETIME),
				description: null,
				draft: true,
				id: expect.stringMatching(UUID),
				title: resource.title,
				url: resource.url,
			});
		});
	});

	describe("GET /", () => {
		it("allows superuser to see all resources", async () => {
			const resource = { title: "foo", url: "bar" };
			await request(app).post("/api/resources").send(resource).expect(201);

			const { body } = await request(app)
				.get("/api/resources")
				.query({ drafts: true })
				.set("Authorization", `Bearer ${process.env.SUDO_TOKEN}`)
				.expect(200);

			expect(body).toHaveLength(1);
			expect(body[0]).toMatchObject(resource);
		});

		it("prevents non-superusers from seeing draft resources", async () => {
			const resource = { title: "title", url: "url" };
			await request(app).post("/api/resources").send(resource).expect(201);

			await request(app)
				.get("/api/resources")
				.query({ drafts: true })
				.expect(200, []);
		});
	});

	describe("PATCH /:id", () => {
		it("allows superusers to publish a draft resource", async () => {
			const { body: resource } = await request(app)
				.post("/api/resources")
				.send({
					title: "CYF Syllabus",
					url: "https://syllabus.codeyourfuture.io/",
				})
				.expect(201);

			const { body: updated } = await request(app)
				.patch(`/api/resources/${resource.id}`)
				.send({ draft: false })
				.set("Authorization", `Bearer ${process.env.SUDO_TOKEN}`)
				.expect(200);

			expect(updated).toEqual({
				...resource,
				draft: false,
				publication: expect.stringMatching(DATETIME),
			});

			const { body: resources } = await request(app).get("/api/resources");
			expect(resources).toHaveLength(1);
		});

		it("rejects other changes", async () => {
			const { body: resource } = await request(app)
				.post("/api/resources")
				.send({
					title: "Mastering margin collapsing",
					url: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Box_Model/Mastering_margin_collapsing",
				})
				.expect(201);

			await request(app)
				.patch(`/api/resources/${resource.id}`)
				.send({ draft: true, title: "Something else" })
				.set("Authorization", `Bearer ${process.env.SUDO_TOKEN}`)
				.expect(400);
		});

		it("handles missing resources", async () => {
			await request(app)
				.patch(`/api/resources/${randomUUID()}`)
				.send({ draft: false })
				.set("Authorization", `Bearer ${process.env.SUDO_TOKEN}`)
				.expect(404);
		});

		it("prevents non-superusers from publishing resources", async () => {
			const { body: resource } = await request(app)
				.post("/api/resources")
				.send({
					title: "PostgreSQL tutorial",
					url: "https://www.postgresqltutorial.com/",
				})
				.expect(201);

			await request(app)
				.patch(`/api/resources/${resource.id}`)
				.send({ draft: false })
				.expect(401);
		});
	});
});
