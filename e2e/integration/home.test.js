beforeEach(() => {
	cy.task("clearDb");
});

it("displays the site", () => {
	cy.visit("/");
	cy.findByRole("heading", { level: 1 }).should("contain.text", "Resources");
});

it("meets basic accessibility guidelines", () => {
	cy.visit("/");
	cy.validateA11y();
});

it("shows existing resources", () => {
	cy.fixture("initialResources").then((fixture) => cy.task("seed", fixture));
	cy.visit("/");
	cy.findByRole("link", { name: "JS TDD Ohm" }).should(
		"have.attr",
		"href",
		"https://blog.jonrshar.pe/2023/May/23/js-tdd-ohm.html"
	);
});

it("allows user to log in", () => {
	// TODO - actually clicking the link didn't work and I couldn't figure out why...
	cy.visit("/api/auth/login");
	cy.findByRole("combobox", { name: /identity/i }).select(
		"admin@codeyourfuture.io"
	);
	cy.findByRole("button", { name: /authenticate/i }).click();
	cy.findByRole("heading", { level: 1 }).should("contain.text", "Resources");
});
