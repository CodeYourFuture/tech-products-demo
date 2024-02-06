import { render, screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
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
			http.get("/api/resources", () => {
				return HttpResponse.json({
					lastPage: 1,
					page: 1,
					perPage: 20,
					resources: [resource],
					totalCount: 1,
				});
			})
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
