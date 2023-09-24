import { randomUUID } from "node:crypto";

import { render, waitFor, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";

import { ResourceService, MemberService } from "../../services";

import DraftDetails from "./DraftDetails";

jest.mock("../../services/memberService");
jest.mock("../../services/resourceService");

const VALIDE_DRAFT_ID = randomUUID();
const SOURCE_ID = randomUUID();
const SOURCE_NAME = "John Doe";
const SOURCE_EMAIL = "John@example.com";

const mockedGetDraftByID = jest.fn().mockImplementation((id) => {
	if (id === VALIDE_DRAFT_ID) {
		return {
			data: { id, title: "Draft Title", source: SOURCE_ID },
			error: undefined,
		};
	}
	return { data: undefined, error: new Error("mock error") };
});

const mockedGetUserByID = jest.fn().mockImplementation((id) => {
	if (id === SOURCE_ID) {
		return {
			data: { id, name: SOURCE_NAME, email: SOURCE_EMAIL },
			error: undefined,
		};
	}
	return { data: undefined, error: new Error("mock error") };
});

describe("Draft Details", () => {
	describe("success", () => {
		beforeEach(() => {
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

		it("should make two get calls", async () => {
			renderComponent(VALIDE_DRAFT_ID);

			await waitFor(() => {
				expect(mockedGetDraftByID).toHaveBeenCalledWith(VALIDE_DRAFT_ID);
			});

			expect(mockedGetUserByID).toHaveBeenCalledWith(SOURCE_ID);
		});

		it("should show user information", async () => {
			renderComponent(VALIDE_DRAFT_ID);

			await waitFor(() => {
				const userName = screen.getByText(SOURCE_NAME);
				expect(userName).toBeVisible();
			});

			const userEmail = screen.getByText(SOURCE_EMAIL);
			expect(userEmail).toBeVisible();
		});
	});

	describe("error", () => {
		it("should show message when resource details not found", async () => {
			renderComponent();

			const errorMessage = await screen.findByText(/Resource Not Found!/);

			expect(errorMessage).toBeVisible();
		});
	});
});

function renderComponent(draftId) {
	render(
		<MemoryRouter initialEntries={[`/drafts/${draftId}`]}>
			<Routes>
				<Route path="drafts/:draftId" element={<DraftDetails />} />
			</Routes>
		</MemoryRouter>
	);
}
