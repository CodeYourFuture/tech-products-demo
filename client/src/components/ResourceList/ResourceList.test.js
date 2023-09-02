import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";

import { resourceStub } from "../../../setupTests";

import ResourceList from "./index";

describe("ResourceList", () => {
	it("shows the resource", () => {
		const resource = resourceStub({
			description:
				'Comprehensive guide to setting up the various types of inputs with React (a.k.a. "data binding")',
			title: "Data Binding in React",
			url: "https://www.joshwcomeau.com/react/data-binding/",
		});

		renderComponent(resource);

		expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
			resource.title
		);
		expect(
			screen.getByRole("link", { name: "joshwcomeau.com" })
		).toHaveAttribute("href", resource.url);
		expect(screen.getByText(/comprehensive guide/i)).toBeInTheDocument();
	});

	it("shows a message if no resources are available", () => {
		render(<ResourceList resources={[]} />);
		expect(screen.getByText(/no resources to show/i)).toBeInTheDocument();
	});

	it("shows a publish button if enabled", async () => {
		const publish = jest.fn();
		const resource = resourceStub();
		const user = userEvent.setup();
		renderComponent(resource, publish);

		await user.click(screen.getByRole("button", { name: /publish/i }));

		expect(publish).toHaveBeenCalledWith(resource.id);
	});

	it("shows the topic if available", () => {
		const resource = resourceStub({ topic_name: "My Topic" });
		renderComponent(resource);
		expect(screen.getByText(resource.topic_name)).toBeInTheDocument();
	});
});

function renderComponent(resource, publish) {
	render(
		<BrowserRouter>
			<ResourceList resources={[resource]} publish={publish} />
		</BrowserRouter>
	);
}
