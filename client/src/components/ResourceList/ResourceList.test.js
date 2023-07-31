import { randomUUID } from "node:crypto";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ResourceList from "./index";

describe("ResourceList", () => {
	it("shows a message if no resources are available", () => {
		render(<ResourceList resources={[]} />);
		expect(screen.getByText(/no resources to show/i)).toBeInTheDocument();
	});

	it("shows a publish button if enabled", async () => {
		const publish = jest.fn();
		const resource = { id: randomUUID() };
		const user = userEvent.setup();
		render(<ResourceList publish={publish} resources={[resource]} />);

		await user.click(screen.getByRole("button", { name: /publish/i }));

		expect(publish).toHaveBeenCalledWith(resource.id);
	});

	it("shows the topic if available", () => {
		const resource = { id: randomUUID(), topic_name: "My Topic" };
		render(<ResourceList resources={[resource]} />);
		expect(screen.getByText(resource.topic_name)).toBeInTheDocument();
	});
});
