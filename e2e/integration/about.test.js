it("can be reached from the homepage", () => {
	cy.visit("/");
	cy.findByText("About").click();
	cy.findByText(/demonstration project/i).should("exist");
});

it("can be reached directly", () => {
	cy.visit("/about");
	cy.findByText(/demonstration project/i).should("exist");
});

it("meets basic accessibility guidelines", () => {
	cy.visit("/about");
	cy.validateA11y();
});
