beforeEach(() => {
	cy.visit("/");
});

it("displays the site", () => {
	cy.findByTestId("message").should("contain.text", "Hello, world!");
});

it("meets basic accessibility guidelines", () => {
	cy.injectAxe();
	cy.checkA11y();
});

it("lets the user submit a resource", () => {
	const title = crypto.randomUUID();
	const url = `https://example.com/${crypto.randomUUID()}`;
	cy.intercept("POST", "/api/resources").as("createResource");
	cy.findByRole("textbox", { name: /title/i }).type(title);
	cy.findByRole("textbox", { name: /url/i }).type(url);
	cy.findByRole("button", { name: /suggest/i }).click();
	cy.wait("@createResource").then(({ request: { body } }) => {
		expect(body).to.have.property("title", title);
		expect(body).to.have.property("url", url);
	});
	cy.findByText(/thank you for suggesting a resource/i).should("exist");
});
