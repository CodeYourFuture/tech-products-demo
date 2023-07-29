import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";

import { server } from "../../../setupTests";

import Suggest from "./index";

describe("Suggest", () => {
	it("allows the user to submit a resource", async () => {
		const title = "hello";
		const url = "https://example.com";
		const user = userEvent.setup();
		server.use(
			rest.post("/api/resources", async (req, res, ctx) => {
				await expect(req.json()).resolves.toEqual({
					description: "",
					title,
					url,
				});
				return res(ctx.json({}));
			})
		);
		render(<Suggest />);

		await user.type(screen.getByRole("textbox", { name: /title/i }), title);
		await user.type(screen.getByRole("textbox", { name: /url/i }), url);
		await user.click(screen.getByRole("button", { name: /suggest/i }));

		await screen.findByText(/thank you for suggesting a resource/i);
		expect(screen.getByRole("form")).toHaveFormValues({
			description: "",
			title: "",
			url: "",
		});
	});

	it("allows the user to include a description", async () => {
		const description = "Check colour contrast for accessibility.";
		const user = userEvent.setup();
		server.use(
			rest.post("/api/resources", async (req, res, ctx) => {
				await expect(req.json()).resolves.toMatchObject({ description });
				return res(ctx.json({}));
			})
		);
		render(<Suggest />);

		await user.type(
			screen.getByRole("textbox", { name: /description/i }),
			description
		);
		await user.type(
			screen.getByRole("textbox", { name: /title/i }),
			"WebAIM Contrast Checker"
		);
		await user.type(
			screen.getByRole("textbox", { name: /url/i }),
			"https://webaim.org/resources/contrastchecker/"
		);
		await user.click(screen.getByRole("button", { name: /suggest/i }));

		await screen.findByText(/thank you for suggesting a resource/i);
	});
});
