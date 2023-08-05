import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useLocation } from "react-router-dom";

import Pagination from "./index";

describe("Pagination", () => {
	it("renders a link for each page", () => {
		renderInRouter(3, { page: 2 });
		const page1 = screen.getByRole("link", { name: /page 1 \(first page\)/i });
		const page2 = screen.getByRole("link", { name: /page 2/i });
		const page3 = screen.getByRole("link", { name: /page 3 \(last page\)/i });
		expect(page1).toHaveAttribute("href", "/test");
		expect(page1).not.toHaveClass("active");
		expect(page2).toHaveAttribute("href", "/test?page=2");
		expect(page2).toHaveClass("active");
		expect(page2).toHaveAttribute("aria-current", "page");
		expect(page3).toHaveAttribute("href", "/test?page=3");
		expect(page3).not.toHaveClass("active");
	});

	it("renders links for next and previous pages", () => {
		renderInRouter(3, { page: 2 });
		expect(
			screen.getByRole("link", { name: /previous page/i })
		).toHaveAttribute("href", "/test");
		expect(screen.getByRole("link", { name: /next page/i })).toHaveAttribute(
			"href",
			"/test?page=3"
		);
	});

	it("does not show previous link on first page", () => {
		renderInRouter(3, { page: 1 });
		expect(
			screen.queryByRole("link", { name: /previous page/i })
		).not.toBeInTheDocument();
	});

	it("does not show next link on last page", () => {
		renderInRouter(3, { page: 3 });
		expect(
			screen.queryByRole("link", { name: /next page/i })
		).not.toBeInTheDocument();
	});

	it("shows page size options", () => {
		const expectedSizes = ["10", "20", "50"];
		renderInRouter(3, { perPage: 10 });
		const pageSizeSelect = screen.getByRole("combobox", {
			name: /items per page/i,
		});
		expect(pageSizeSelect).toHaveValue("10");
		expect(within(pageSizeSelect).getAllByRole("option")).toHaveLength(
			expectedSizes.length
		);
		expectedSizes.forEach((size) => {
			expect(
				within(pageSizeSelect).getByRole("option", { name: size })
			).toHaveValue(size);
		});
	});

	it("reset page when page size changes", async () => {
		const user = userEvent.setup();
		renderInRouter(3, { page: 2 });
		await user.selectOptions(
			screen.getByRole("combobox", { name: /items per page/i }),
			"50"
		);
		expect(screen.getByRole("link", { name: /current page/i })).toHaveAttribute(
			"href",
			"/test?perPage=50"
		);
	});
});

function RevealLocation() {
	const { pathname, search } = useLocation();
	return <a href={`${pathname}${search}`}>Current page</a>;
}

const renderInRouter = (lastPage = 3, searchParams = {}) =>
	render(
		<MemoryRouter
			initialEntries={[`/test?${new URLSearchParams(searchParams)}`]}
		>
			<RevealLocation />
			<Pagination lastPage={lastPage} />
		</MemoryRouter>
	);
