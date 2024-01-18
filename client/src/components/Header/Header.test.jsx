import { fireEvent, render, screen, within } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";

import { usePrincipal } from "../../authContext";

import Header from "./index";

jest.mock("../../authContext");

const renderWithHistory = () => {
	const history = createMemoryHistory();
	const utils = render(
		<Router location={history.location} navigator={history}>
			<Header />
		</Router>
	);
	return { ...utils, history };
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

	it("allows the authenticated user to go to the suggest page", () => {
		usePrincipal.mockReturnValue({});
		renderWithHistory();
		expect(screen.getByRole("link", { name: /suggest/i })).toHaveAttribute(
			"href",
			"/suggest"
		);
	});

	it("does not allow the authenticated user to go to the suggest page", () => {
		usePrincipal.mockReturnValue(undefined);
		renderWithHistory();
		expect(
			screen.queryByRole("link", { name: /suggest/i })
		).not.toBeInTheDocument();
	});

	it("allows admin users to go to the drafts page", () => {
		usePrincipal.mockReturnValue({ is_admin: true });
		renderWithHistory();
		expect(screen.getByRole("link", { name: /drafts/i })).toHaveAttribute(
			"href",
			"/drafts"
		);
	});

	it("does not allow other users to go to the drafts page", () => {
		usePrincipal.mockReturnValue({});
		renderWithHistory();
		expect(
			screen.queryByRole("link", { name: /drafts/i })
		).not.toBeInTheDocument();
	});
});
