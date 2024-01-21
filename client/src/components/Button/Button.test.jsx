import { render, screen } from "@testing-library/react";

import Button from "./index";

describe("Button", () => {
	it("renders a button", () => {
		render(
			<Button onClick={vi.fn()} style="primary">
				Click me
			</Button>
		);
		const button = screen.getByRole("button", { name: /click me/i });
		expect(button).toHaveClass("button", "primary");
		expect(button).toHaveAttribute("type", "button");
	});

	it("renders a secondary button", () => {
		render(<Button style="secondary">Click me</Button>);
		expect(screen.getByRole("button", { name: /click me/i })).toHaveClass(
			"button",
			"secondary"
		);
	});

	it("renders a submit button with no onClick handler", () => {
		render(<Button style="primary">Click me</Button>);
		expect(screen.getByRole("button", { name: /click me/i })).toHaveAttribute(
			"type",
			"submit"
		);
	});

	it("renders an id if provided", () => {
		render(
			<Button id="my-button" style="primary">
				Click me
			</Button>
		);
		expect(
			screen.getByRole("button", { name: /click me/i })
		).toBeInTheDocument();
	});

	it("uses an explicit type if supplied", () => {
		render(
			<Button style="primary" type="reset">
				Click me
			</Button>
		);
		expect(screen.getByRole("button", { name: /click me/i })).toHaveAttribute(
			"type",
			"reset"
		);
	});
});
