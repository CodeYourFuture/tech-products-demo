import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { MemoryRouter } from "react-router-dom";

// Importing the hook directly from the source
import * as useFetchPublishedResourcesModule from "../../hooks";

// Mocking the hook
jest.mock("../../hooks/useFetchPublishedResources", () => ({
	useFetchPublishedResources: jest.fn(),
}));

// Importing the component after mocking the hook
import TopicSelector from "./TopicSelector";

import ResourceList from "./index";

describe("ResourceList", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});
	const topics = [
		{ id: "199a529b-22c1-460f-bc51-387cb12225e8", name: "Git" },
		{ id: "84b099a4-8acd-4659-b5bd-1b89796fb924", name: "HTML/CSS" },
	];
	const resourceData = [
		{
			id: "1",
			title: "A Complete Guide to Flexbox",
			url: "https://www.joshwcomeau.com/react/data-binding/",
			topics: "84b099a4-8acd-4659-b5bd-1b89796fb924",
			topic_name: "HTML/CSS",
		},
		{
			id: "2",
			title: "React Hooks Tutorial",
			url: "https://reactjs.org/docs/hooks-intro.html",
			topics: "199a529b-22c1-460f-bc51-387cb12225e8",
			topic_name: "React",
		},
	];

	it("shows a message if no resources are available", async () => {
		// Mocking the return value of the hook
		useFetchPublishedResourcesModule.useFetchPublishedResources.mockReturnValueOnce(
			{
				perPage: 10,
				page: 1,
				allResources: [],
			}
		);

		render(
			<MemoryRouter>
				<ResourceList />
			</MemoryRouter>
		);

		await waitFor(() => {
			expect(screen.getByText(/no resources to show/i)).toBeInTheDocument();
		});
	});

	it("shows the topic if available", async () => {
		// Mocking the return value of the hook to include resources with a topic
		useFetchPublishedResourcesModule.useFetchPublishedResources.mockReturnValueOnce(
			{
				perPage: 10,
				page: 1,
				allResources: resourceData,
			}
		);

		render(
			<MemoryRouter>
				<ResourceList />
			</MemoryRouter>
		);

		await waitFor(() => {
			expect(screen.getByText(resourceData[0].topic_name)).toBeInTheDocument();
		});
	});

	it("displays only resources with the selected topic", async () => {
		useFetchPublishedResourcesModule.useFetchPublishedResources.mockReturnValueOnce(
			{
				perPage: 10,
				page: 1,
				allResources: resourceData,
			}
		);

		render(
			<MemoryRouter>
				<TopicSelector topics={topics} setSelectedTopic={() => {}} />
			</MemoryRouter>
		);

		// Select the topic "HTML/CSS"
		await userEvent.selectOptions(
			screen.getByRole("combobox", { name: /filter topic/i }),
			"HTML/CSS"
		);

		// Ensure that only resources with the selected topic are displayed
		expect(
			expect(screen.getByText(resourceData[0].title)).toBeInTheDocument()
		).toBeInTheDocument();
		expect(screen.queryByText(resourceData[1].title)).not.toBeInTheDocument();
	});
});
