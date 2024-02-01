import { render, screen, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { usePrincipal } from "../../authContext";
import { ResourceList } from "../../components";

import Account from "./index";

jest.mock("../../authContext");
jest.mock("../../components/ResourceList/index");

describe("Account", () => {
	const id = "c4f32c85-fd0a-4a3b-b5d5-42ca7ade19ec";
	const email = "bluepanda897@example.com";
	const name = "Danitsja Mennink";
	it("shows the user when available with their resoure", () => {
		usePrincipal.mockReturnValue({ id, name, email });
		render(
			<MemoryRouter initialEntries={["/account"]}>
				<Account />
			</MemoryRouter>
		);
		expect(screen.getByText(email)).toBeInTheDocument();
		expect(screen.getByText(name)).toBeInTheDocument();
		expect(screen.getByText("My Resources")).toBeInTheDocument();
		expect(ResourceList).toHaveBeenCalled();
	});

	it("shows an alternative when email unavailable", () => {
		usePrincipal.mockReturnValue({ id, name });
		render(
			<MemoryRouter initialEntries={["/account"]}>
				<Account />
			</MemoryRouter>
		);
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
		render(
			<MemoryRouter initialEntries={["/account"]}>
				<Account />
			</MemoryRouter>
		);
		const form = screen.getByRole("form");
		expect(form).toHaveAttribute("action", "/api/auth/logout");
		expect(form).toHaveAttribute("method", "POST");
		expect(
			within(form).getByRole("button", { name: /log out/i })
		).toHaveAttribute("type", "submit");
	});
});
