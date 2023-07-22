import { fireEvent, render } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";

import { getResources } from "../services/resourceService";

import { Home } from "./Home";

jest.mock("../services/resourceService");

const renderWithHistory = () => {
	const history = createMemoryHistory();
	const wrapper = render(
		<Router location={history.location} navigator={history}>
			<Home />
		</Router>
	);
	return { ...wrapper, history };
};

describe("Home", () => {
	it("allows the user to navigate to the About page", () => {
		getResources.mockReturnValue(new Promise(() => {}));
		const { getByText, history } = renderWithHistory();
		fireEvent.click(getByText("About"));
		expect(history.location.pathname).toBe("/about/this/site");
	});
});
