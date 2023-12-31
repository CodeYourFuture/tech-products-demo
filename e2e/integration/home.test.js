it("displays the site", () => {
	cy.visit("/");
	cy.findByRole("heading", { level: 1 }).should("contain.text", "Resources");
});

it("meets basic accessibility guidelines", () => {
	cy.visit("/");
	cy.validateA11y();
});

it("shows existing resources", () => {
	cy.seed("onePublishedResource");
	cy.visit("/");
	cy.findByRole("heading", { level: 3 }).should("contain.text", "JS TDD Ohm");
	cy.findByRole("link", { name: "blog.jonrshar.pe" }).should(
		"have.attr",
		"href",
		"https://blog.jonrshar.pe/2023/May/23/js-tdd-ohm.html"
	);
});

it("allows user to log in", () => {
	cy.visit("/");
	cy.logInAs("admin@codeyourfuture.io");
	cy.findByRole("heading", { level: 1 }).should("contain.text", "Resources");
});

it("supports users without public emails", () => {
	cy.visit("/");
	cy.logInAs("shh@example.com");
	cy.findByRole("heading", { level: 1 }).should("contain.text", "Resources");
});
