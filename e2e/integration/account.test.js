it("shows the user's details", () => {
	const email = "admin@codeyourfuture.io";
	cy.visit("/");
	cy.logInAs(email);
	cy.findByRole("link", { name: /account/i }).click();
	cy.findByText(email).should("exist");
	cy.findByText("Cyf Admin").should("exist");
});

it("lets the user log out", () => {
	cy.visit("/");
	cy.logInAs("shh@example.com");
	cy.findByRole("link", { name: /account/i }).click();
	cy.findByRole("button", { name: /log out/i }).click();
	cy.findByRole("link", { name: /log in/i }).should("exist");
});
