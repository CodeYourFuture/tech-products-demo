import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { usePrincipal } from "../../authContext";

import Authenticated from "./index";

jest.mock("../../authContext");

describe("Authenticated", () => {
	it("shows the protected page to authenticated users", () => {
		usePrincipal.mockReturnValue({});
		renderInRouter();
		expect(screen.getByText("Protected page.")).toBeInTheDocument();
		expect(screen.queryByText("Home page.")).not.toBeInTheDocument();
	});

	it("does not show the protected page to unauthenticated users", () => {
		usePrincipal.mockReturnValue(undefined);
		renderInRouter();
		expect(screen.getByText("Home page.")).toBeInTheDocument();
		expect(screen.queryByText("Protected page.")).not.toBeInTheDocument();
	});

	describe("adminOnly", () => {
		it("shows the protected page to admin users", () => {
			usePrincipal.mockReturnValue({ is_admin: true });
			renderInRouter({ adminOnly: true });
			expect(screen.getByText("Protected page.")).toBeInTheDocument();
			expect(screen.queryByText("Home page.")).not.toBeInTheDocument();
		});

		it("does not show the protected page to non-admin users", () => {
			usePrincipal.mockReturnValue({ is_admin: false });
			renderInRouter({ adminOnly: true });
			expect(screen.getByText("Home page.")).toBeInTheDocument();
			expect(screen.queryByText("Protected page.")).not.toBeInTheDocument();
		});

		it("does not show the protected page to unauthenticated users", () => {
			usePrincipal.mockReturnValue(undefined);
			renderInRouter({ adminOnly: true });
			expect(screen.getByText("Home page.")).toBeInTheDocument();
			expect(screen.queryByText("Protected page.")).not.toBeInTheDocument();
		});
	});
});

function renderInRouter(props = {}) {
	const protectedRoute = "/protected";
	render(
		<MemoryRouter initialEntries={[protectedRoute]}>
			<Routes>
				<Route path="/" element={<p>Home page.</p>} />
				<Route path={protectedRoute} element={<Authenticated {...props} />}>
					<Route index element={<p>Protected page.</p>}></Route>
				</Route>
			</Routes>
		</MemoryRouter>
	);
}
