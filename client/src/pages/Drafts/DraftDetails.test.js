import { randomUUID } from "node:crypto";

import { render, waitFor } from "@testing-library/react";
import Router, { BrowserRouter } from "react-router-dom";

import { ResourceService, MemberService } from "../../services";

import DraftDetails from "./DraftDetails";

jest.mock("../../services/MemberService");
jest.mock("../../services/ResourceService");

jest.mock("react-router-dom", () => ({
	...jest.requireActual("react-router-dom"),
	useParams: jest.fn(),
}));

const mockedGetDraftByID = jest.fn().mockImplementation((id) => {
	if (id === VALIDE_DRAFT_ID) {
		return {
			data: { id, title: "Draft Title", recommender: RECOMMENDER_ID },
			error: undefined,
		};
	}
	return { data: undefined, error: new Error("mock error") };
});

const mockedGetUserByID = jest.fn().mockImplementation((id) => {
	if (id === RECOMMENDER_ID) {
		return { data: { id, name: RECOMMENDER_NAME }, error: undefined };
	}
	return { data: undefined, error: new Error("mock error") };
});

const VALIDE_DRAFT_ID = randomUUID();
const RECOMMENDER_ID = randomUUID();
const RECOMMENDER_NAME = "John Doe";

describe("Draft Details", () => {
	beforeEach(() => {
		jest
			.spyOn(Router, "useParams")
			.mockReturnValue({ draftId: VALIDE_DRAFT_ID });

		MemberService.mockImplementation(() => {
			return {
				getUserById: mockedGetUserByID,
			};
		});

		ResourceService.mockImplementation(() => {
			return {
				getDraftById: mockedGetDraftByID,
			};
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("should show make get calls", async () => {
		renderComponent();

		expect(Router.useParams).toHaveBeenCalled();

		await waitFor(() => {
			expect(mockedGetDraftByID).toHaveBeenCalledWith(VALIDE_DRAFT_ID);
		});
		expect(mockedGetUserByID).toHaveBeenCalledWith(RECOMMENDER_ID);
	});
});

function renderComponent() {
	render(
		<BrowserRouter>
			<DraftDetails />
		</BrowserRouter>
	);
}
