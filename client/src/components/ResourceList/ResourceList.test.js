import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import { resourceStub, server } from "../../../setupTests";
import * as useFetchPublishedResourcesModule from "../../hooks";

import TopicSelector from "./TopicSelector";

import ResourceList from "./index";

server.use(
	rest.get("/api/topics", (req, res, ctx) => {
		return res(
			ctx.json([
				{
					id: "199a529b-22c1-460f-bc51-387cb12225e8",
					name: "Git",
				},
				{
					id: "84b099a4-8acd-4659-b5bd-1b89796fb924",
					name: "HTML/CSS",
				},
			])
		);
	})
);

jest.mock("../../hooks/useFetchPublishedResources", () => ({
	useFetchPublishedResources: jest.fn(),
}));

jest.mock("../../hooks/useFetchTopics", () => ({
	useFetchTopics: jest.fn(),
}));

describe("ResourceList", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	const topics = [
		{ id: "199a529b-22c1-460f-bc51-387cb12225e8", name: "Git" },
		{ id: "84b099a4-8acd-4659-b5bd-1b89796fb924", name: "HTML/CSS" },
	];

	const resourceData = [
		resourceStub({
			id: "1",
			title: "A Complete Guide to Flexbox",
			url: "https://www.joshwcomeau.com/react/data-binding/",
			topics: "84b099a4-8acd-4659-b5bd-1b89796fb924",
			topic_name: "HTML/CSS",
		}),
		resourceStub({
			id: "2",
			title: "React Hooks Tutorial",
			url: "https://reactjs.org/docs/hooks-intro.html",
			topics: "199a529b-22c1-460f-bc51-387cb12225e8",
			topic_name: "React",
		}),
	];

	it("shows resources", async () => {
		const resource = resourceStub({
			description: "This is a very useful resource I found",
			id: "abc123",
			title: "Hello",
			url: "https://example.com",
		});

		useFetchPublishedResourcesModule.useFetchPublishedResources.mockReturnValueOnce(
			{
				perPage: 20,
				page: 1,
				allResources: [resource],
			}
		);

		render(
			<MemoryRouter>
				<ResourceList />
			</MemoryRouter>
		);

		await expect(
			screen.findByRole("heading", { name: resource.title })
		).resolves.toBeInTheDocument();

		expect(screen.getByRole("link", { name: "example.com" })).toHaveAttribute(
			"href",
			resource.url
		);

		expect(
			screen.getByText(new RegExp(resource.description))
		).toBeInTheDocument();
	});

	it("shows a message if no resources are available", async () => {
		useFetchPublishedResourcesModule.useFetchPublishedResources.mockReturnValueOnce(
			{
				perPage: 10,
				page: 1,
				allResources: [],
			}
		);
		useFetchPublishedResourcesModule.useFetchTopics.mockReturnValueOnce([]);
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
		useFetchPublishedResourcesModule.useFetchPublishedResources.mockReturnValueOnce(
			{
				perPage: 20,
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
		const setSelectedTopicMock = jest.fn();

		server.use(
			rest.get("/api/resources", (req, res, ctx) => {
				return res(ctx.json({ resources: resourceData }));
			})
		);

		useFetchPublishedResourcesModule.useFetchPublishedResources.mockReturnValueOnce(
			{
				perPage: 20,
				page: 1,
				allResources: resourceData.filter(
					(resource) => resource.topic_name === "HTML/CSS"
				),
			}
		);

		render(
			<MemoryRouter>
				<TopicSelector
					topics={topics}
					setSelectedTopic={setSelectedTopicMock}
				/>
			</MemoryRouter>
		);

		await userEvent.selectOptions(
			screen.getByRole("combobox", { name: /filter topic/i }),
			"HTML/CSS"
		);

		render(
			<MemoryRouter>
				<ResourceList />
			</MemoryRouter>
		);

		expect(screen.getByText("A Complete Guide to Flexbox")).toBeInTheDocument();
		expect(screen.queryByText("React Hooks Tutorial")).not.toBeInTheDocument();
	});
});
