import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";

import { resourceStub, server } from "../../../setupTests";

import Drafts from "./index";

describe("Drafts", () => {
	it("shows draft resources", async () => {
		const resource = resourceStub({
			draft: true,
			id: "abc123",
			title: "foo",
			url: "https://example.com",
		});
		server.use(
			http.get("/api/resources", () => {
				return HttpResponse.json({ resources: [resource] });
			})
		);
		render(<Drafts />);
		await expect(
			screen.findByRole("heading", { level: 3 })
		).resolves.toHaveTextContent("foo");
	});

	it("lets those resources be published", async () => {
		let patchRequest;
		const resource = resourceStub({
			draft: true,
			id: "abc123",
			title: "foo",
			url: "https://example.com",
		});
		const getResponses = [[resource], []];
		const user = userEvent.setup();
		server.use(
			http.get("/api/resources", () => {
				return HttpResponse.json({ resources: getResponses.shift() });
			}),
			http.patch("/api/resources/:id", (info) => {
				patchRequest = info;
				return HttpResponse.json({ ...resource, draft: false });
			})
		);
		render(<Drafts />);

		const publishButton = await screen.findByRole("button", {
			name: /publish/i,
		});
		await user.click(publishButton);

		await screen.findByText(/no resources to show/i);
		expect(patchRequest.params.id).toBe(resource.id);
	});
});
