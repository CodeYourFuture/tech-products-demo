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
});
