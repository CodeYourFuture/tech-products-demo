import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";

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
			rest.get("/api/resources", (req, res, ctx) => {
				return res(ctx.json({ resources: [resource] }));
			}),

			rest.get("/api/topics", (req, res, ctx) => {
				const mockTopics = [
					{ id: "1", name: "Topic 1" },
					{ id: "2", name: "Topic 2" },
				];
				return res(ctx.json(mockTopics));
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
			rest.get("/api/resources", (req, res, ctx) => {
				return res(ctx.json({ resources: getResponses.shift() }));
			}),
			rest.patch("/api/resources/:id", (req, res, ctx) => {
				patchRequest = req;
				return res(ctx.json({ ...resource, draft: false }));
			}),
			rest.get("/api/topics", (req, res, ctx) => {
				const mockTopics = [
					{ id: "1", name: "Topic 1" },
					{ id: "2", name: "Topic 2" },
				];
				return res(ctx.json(mockTopics));
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
