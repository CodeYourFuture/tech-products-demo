import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { createResource } from "../services/resourceService";

import SuggestResource from "./SuggestResource";

jest.mock("../services/resourceService");

describe("SuggestResource", () => {
	it("allows the user to submit a resource", async () => {
		createResource.mockResolvedValue();
		const title = "hello";
		const url = "https://example.com";
		const user = userEvent.setup();
		render(<SuggestResource />);

		await user.type(screen.getByRole("textbox", { name: /title/i }), title);
		await user.type(screen.getByRole("textbox", { name: /url/i }), url);
		await user.click(screen.getByRole("button", { name: /suggest/i }));

		await screen.findByText(/thank you for suggesting a resource/i);
		expect(createResource).toHaveBeenCalledWith({ title, url });
		expect(screen.getByRole("form")).toHaveFormValues({ title: "", url: "" });
	});
});
