import { randomUUID } from "node:crypto";

import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";

import { server } from "../../../setupTests";
import * as authContext from "../../authContext";

import Suggest from "./index";

jest.mock("../../authContext");

describe("Suggest", () => {
	it("allows the user to submit a resource", async () => {
		let requestBody;
		const title = "hello";
		const url = "https://example.com";
		const recommender = "2b62c129-c735-4b8a-8bef-624bbcdbb0a9";
		const user = userEvent.setup();
		server.use(
			rest.get("/api/topics", (req, res, ctx) => res(ctx.json([]))),
			rest.post("/api/resources", async (req, res, ctx) => {
				requestBody = await req.json();
				return res(ctx.status(201), ctx.json({}));
			})
		);
		renderComponent();

		await user.type(screen.getByRole("textbox", { name: /title/i }), title);
		await user.type(screen.getByRole("textbox", { name: /url/i }), url);
		await user.click(screen.getByRole("button", { name: /suggest/i }));

		await expect(
			screen.findByText(/thank you for suggesting a resource/i)
		).resolves.toHaveClass("message", "success");
		expect(requestBody).toEqual({ title, url, recommender });
		expect(screen.getByRole("form")).toHaveFormValues({
			description: "",
			title: "",
			url: "",
		});
	});

	it("allows the user to include a description", async () => {
		const description = "Check colour contrast for accessibility.";
		let requestBody;
		const user = userEvent.setup();
		server.use(
			rest.get("/api/topics", (req, res, ctx) => res(ctx.json([]))),
			rest.post("/api/resources", async (req, res, ctx) => {
				requestBody = await req.json();
				return res(ctx.status(201), ctx.json({}));
			})
		);
		renderComponent();

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
		expect(requestBody).toHaveProperty("description", description);
	});

	it("gives useful feedback on failure", async () => {
		const title = "Official React documentation";
		const url = "https://react.dev/";
		const user = userEvent.setup();
		server.use(
			rest.get("/api/topics", (req, res, ctx) => res(ctx.json([]))),
			rest.post("/api/resources", (req, res, ctx) => {
				return res(ctx.status(409));
			})
		);
		render(<Suggest />);
		await user.type(screen.getByRole("textbox", { name: /title/i }), title);
		await user.type(screen.getByRole("textbox", { name: /url/i }), url);
		await user.click(screen.getByRole("button", { name: /suggest/i }));
		await expect(
			screen.findByText(
				"Resource suggestion failed: a very similar resource already exists."
			)
		).resolves.toHaveClass("message", "failure");
		expect(screen.getByRole("textbox", { name: /title/i })).toHaveValue(title);
		expect(screen.getByRole("textbox", { name: /url/i })).toHaveValue(url);
	});

	it("shows the list of topics", async () => {
		const topics = {
			"HTML/CSS": randomUUID(),
			JavaScript: randomUUID(),
			"Professional Development": randomUUID(),
		};
		server.use(
			rest.get("/api/topics", (req, res, ctx) => {
				return res(
					ctx.json(
						Object.entries(topics).map(([topic, id]) => ({ id, name: topic }))
					)
				);
			})
		);

		renderComponent();

		expect(
			within(screen.getByRole("combobox", { name: /topic/i })).getByRole(
				"option",
				{ name: /select a topic/i }
			)
		).toBeDisabled();
		await waitFor(() =>
			expect(
				within(screen.getByRole("combobox", { name: /topic/i }))
					.getAllByRole("option")
					.map((el) => el.textContent)
			).toEqual(expect.arrayContaining(Object.keys(topics)))
		);
	});

	it("allows the user to include a topic", async () => {
		let requestBody;
		const topic = "Professional Development";
		const topicId = randomUUID();
		const user = userEvent.setup();
		server.use(
			rest.get("/api/topics", (_, res, ctx) => {
				return res(ctx.json([{ id: topicId, name: topic }]));
			}),
			rest.post("/api/resources", async (req, res, ctx) => {
				requestBody = await req.json();
				return res(ctx.status(201), ctx.json({}));
			})
		);

		renderComponent();
		await user.type(screen.getByRole("textbox", { name: /title/i }), "Title");
		await user.type(
			screen.getByRole("textbox", { name: /url/i }),
			"https://example.com"
		);
		await user.selectOptions(
			screen.getByRole("combobox", { name: /topic/i }),
			topic
		);
		await user.click(screen.getByRole("button", { name: /suggest/i }));

		await screen.findByText(/thank you for suggesting a resource/i);
		expect(requestBody).toHaveProperty("topic", topicId);
	});

	it("allows the user to reset the form", async () => {
		const title = "Title";
		const topic = "Some Topic";
		const user = userEvent.setup();
		server.use(
			rest.get("/api/topics", (_, res, ctx) => {
				return res(ctx.json([{ id: randomUUID(), name: topic }]));
			})
		);
		renderComponent();
		await user.type(screen.getByRole("textbox", { name: /title/i }), title);
		await user.selectOptions(
			screen.getByRole("combobox", { name: /topic/i }),
			topic
		);

		await user.click(screen.getByRole("button", { name: /clear/i }));

		expect(screen.getByRole("textbox", { name: /title/i })).toHaveValue("");
		expect(screen.getByRole("combobox", { name: /topic/i })).toHaveValue("");
	});
});

function renderComponent() {
	authContext.usePrincipal.mockReturnValue({
		id: "2b62c129-c735-4b8a-8bef-624bbcdbb0a9",
	});
	render(<Suggest />);
}
