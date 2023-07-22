import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";

import { server } from "../../../setupTests";

import SuggestResource from "./index";

describe("SuggestResource", () => {
	it("allows the user to submit a resource", async () => {
		const title = "hello";
		const url = "https://example.com";
		const user = userEvent.setup();
		server.use(
			rest.post("/api/resources", async (req, res, ctx) => {
				await expect(req.json()).resolves.toEqual({ title, url });
				return res(ctx.json({}));
			})
		);
		render(<SuggestResource />);

		await user.type(screen.getByRole("textbox", { name: /title/i }), title);
		await user.type(screen.getByRole("textbox", { name: /url/i }), url);
		await user.click(screen.getByRole("button", { name: /suggest/i }));

		await screen.findByText(/thank you for suggesting a resource/i);
		expect(screen.getByRole("form")).toHaveFormValues({ title: "", url: "" });
	});
});
