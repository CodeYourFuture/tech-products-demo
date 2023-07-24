import { fireEvent, render, screen, within } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";

import Header from "./index";

const renderWithHistory = () => {
	const history = createMemoryHistory();
	const wrapper = render(
		<Router location={history.location} navigator={history}>
			<Header />
		</Router>
	);
	return { ...wrapper, history };
};

describe("Home", () => {
	it("allows the user to navigate to the About page", () => {
		const { history } = renderWithHistory();
		fireEvent.click(screen.getByText("About"));
		expect(history.location.pathname).toBe("/about");
	});

	it("allows the user to return to the home page", () => {
		renderWithHistory();
		expect(
			within(screen.getByRole("heading", { level: 1 })).getByRole("link")
		).toHaveAttribute("href", "/");
	});

	it("allows the user to go to the suggest page", () => {
		renderWithHistory();
		expect(screen.getByRole("link", { name: /suggest/i })).toHaveAttribute(
			"href",
			"/suggest"
		);
	});
});
