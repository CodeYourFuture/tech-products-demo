import { render, screen, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { usePrincipal } from "../../authContext";

import Account from "./index";

vi.mock("../../authContext");

describe("Account", () => {
	it("shows the user when available", () => {
		const email = "bluepanda897@example.com";
		const name = "Danitsja Mennink";
		usePrincipal.mockReturnValue({ email, name });
		render(<Account />);
		expect(screen.getByText(email)).toBeInTheDocument();
		expect(screen.getByText(name)).toBeInTheDocument();
	});

	it("shows an alternative when email unavailable", () => {
		const name = "Danitsja Mennink";
		usePrincipal.mockReturnValue({ name });
		render(<Account />);
		expect(screen.getByText("N/A")).toBeInTheDocument();
		expect(screen.getByText(name)).toBeInTheDocument();
	});

	it("returns to home page when user unavailable", () => {
		usePrincipal.mockReturnValue(undefined);
		render(
			<MemoryRouter initialEntries={["/account"]}>
				<Account />
				<Routes>
					<Route path="/" element={<p>Home!</p>} />
					<Route path="/account" element={<Account />} />
				</Routes>
			</MemoryRouter>
		);
		expect(screen.getByText("Home!")).toBeInTheDocument();
	});

	it("shows a logout link", () => {
		usePrincipal.mockReturnValue({ email: "", name: "" });
		render(<Account />);
		const form = screen.getByRole("form");
		expect(form).toHaveAttribute("action", "/api/auth/logout");
		expect(form).toHaveAttribute("method", "POST");
		expect(
			within(form).getByRole("button", { name: /log out/i })
		).toHaveAttribute("type", "submit");
	});
});
