import { render, screen } from "@testing-library/react";
import { rest } from "msw";
import { MemoryRouter } from "react-router-dom";

import { resourceStub, server } from "../../../setupTests";

import Home from "./index";

describe("Home", () => {
	it("shows resources", async () => {
		const resource = resourceStub({
			description: "This is a very useful resource I found",
			id: "abc123",
			title: "Hello",
			url: "https://example.com",
		});
		server.use(
			rest.get("/api/resources", (req, res, ctx) => {
				return res(
					ctx.json({
						lastPage: 1,
						page: 1,
						perPage: 20,
						resources: [resource],
						totalCount: 1,
					})
				);
			}),
			rest.get("/api/topics", (req, res, ctx) => res(ctx.json([])))
		);
		render(
			<MemoryRouter>
				<Home />
			</MemoryRouter>
		);

		await expect(
			screen.findByRole("heading", { level: 3 })
		).resolves.toHaveTextContent(resource.title);
		expect(screen.getByRole("link", { name: "example.com" })).toHaveAttribute(
			"href",
			resource.url
		);
		expect(
			screen.getByText(new RegExp(resource.description))
		).toBeInTheDocument();
	});
});
