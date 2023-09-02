it("lets admin users approve drafts", () => {
	const adminEmail = "admin@codeyourfuture.io";
	const baseUrl = Cypress.config().baseUrl;
	cy.seed("admin");
	cy.seed("oneDraftResource");
	cy.visit("/");

	cy.logInAs(adminEmail);
	cy.findByRole("link", { name: /drafts/i }).click();
	cy.findByText("Joi documentation").click();
	cy.url().should("contain", `${baseUrl}/drafts/`);
	cy.contains("shh@example.com");
	cy.contains("discreet-volunteer");
	cy.contains(456);
	cy.findByRole("button", { name: "back" }).click();
	cy.findByRole("button", { name: /publish/i }).click();
	cy.findByText("Joi documentation").should("not.exist");
	cy.logOut();
	cy.logInAs("shh@example.com");
	cy.findByRole("heading", { level: 3 }).should(
		"contain.text",
		"Joi documentation"
	);
	cy.findByRole("link", { name: "joi.dev" }).should(
		"have.attr",
		"href",
		"https://joi.dev/"
	);
	cy.findByRole("link", { name: /drafts/i }).should("not.exist");
});
