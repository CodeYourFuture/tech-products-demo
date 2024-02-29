import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";

import { resourceStub, server } from "../../../setupTests";

import ResourceList from "./index";

describe("ResourceList", () => {
	it("shows a message if no resources are available", () => {
		render(<ResourceList resources={[]} />);
		expect(screen.getByText(/no resources to show/i)).toBeInTheDocument();
	});

	it("shows the topic if available", () => {
		const resource = resourceStub({ topic_name: "My Topic" });
		render(<ResourceList resources={[resource]} />);
		expect(screen.getByText(resource.topic_name)).toBeInTheDocument();
	});

	it("displays only resources with the selected topic", async () => {
		const resource1 = resourceStub({
			description:
				'Comprehensive guide to setting up the various types of inputs with React (a.k.a. "data binding")',
			title: "A Complete Guide to Flexbox",
			url: "https://www.joshwcomeau.com/react/data-binding/",
			topic: "84b099a4-8acd-4659-b5bd-1b89796fb924",
			topic_name: "HTML/CSS",
		});

		const resource2 = resourceStub({
			description: "Another resource with a different topic",
			title: "Another Resource",
			url: "https://example.com",
			topic: "b3ab63b8-65f9-4f10-bac2-ce51ad1244c4",
			topic_name: "Node & Express",
		});

		const resources = [resource1, resource2];

		server.use(
			rest.get("/api/topics", (req, res, ctx) =>
				res(
					ctx.json([
						{ id: "84b099a4-8acd-4659-b5bd-1b89796fb924", name: "HTML/CSS" },
						{
							id: "b3ab63b8-65f9-4f10-bac2-ce51ad1244c4",
							name: "Node & Express",
						},
					])
				)
			)
		);

		render(<ResourceList resources={resources} />);

		// Wait for the select menu to be enabled and options to be populated
		await waitFor(() => {
			expect(
				within(
					screen.getByRole("combobox", { name: /filter topic/i })
				).getByText("HTML/CSS")
			).toBeInTheDocument();
		});

		// Select the desired topic
		await userEvent.selectOptions(
			screen.getByRole("combobox", { name: /filter topic/i }),
			"HTML/CSS"
		);

		// Ensure that only resources with the selected topic are displayed
		expect(screen.getByText(resource1.title)).toBeInTheDocument();
		expect(screen.queryByText(resource2.title)).not.toBeInTheDocument();
	});
});
