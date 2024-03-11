import { render, screen } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";

import { Home } from "./";
describe("Home Component", () => {
	it("renders the ResourceList component", () => {
		render(
			<MemoryRouter>
				<Home />
			</MemoryRouter>
		);

		const resourceTitle = screen.getByRole("combobox", {
			name: /filter topic/i,
		});
		expect(resourceTitle).toBeInTheDocument();
	});
});
