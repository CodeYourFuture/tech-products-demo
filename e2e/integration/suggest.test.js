beforeEach(() => {
	cy.task("clearDb");
});

it("meets basic accessibility guidelines", () => {
	cy.visit("/suggest");
	cy.validateA11y();
});

it("lets the user submit a resource", () => {
	cy.visit("/");
	cy.findByRole("link", { name: /suggest/i }).click();
	const description = "This is a useful thing to read.";
	const title = crypto.randomUUID();
	const url = `https://example.com/${crypto.randomUUID()}`;
	cy.intercept("POST", "/api/resources").as("createResource");
	cy.findByRole("textbox", { name: /description/i }).type(description);
	cy.findByRole("textbox", { name: /title/i }).type(title);
	cy.findByRole("textbox", { name: /url/i }).type(url);
	cy.findByRole("button", { name: /suggest/i }).click();
	cy.wait("@createResource").then(
		({ request: { body: submitted }, response: { body: created } }) => {
			expect(submitted).to.have.property("description", description);
			expect(submitted).to.have.property("title", title);
			expect(submitted).to.have.property("url", url);
			cy.request({
				body: { draft: false },
				headers: { Authorization: `Bearer ${Cypress.env("SUDO_TOKEN")}` },
				method: "PATCH",
				url: `/api/resources/${created.id}`,
			});
		}
	);
	cy.findByText(/thank you for suggesting a resource/i).should("exist");
	cy.visit("/");
	cy.findByText(title).should("have.attr", "href", url);
	cy.findByText(new RegExp(description)).should("exist");
});
