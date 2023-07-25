it("shows the user's details", () => {
	const email = "admin@codeyourfuture.io";
	cy.logInAs(email);
	cy.findByRole("link", { name: /account/i }).click();
	cy.findByText(email).should("exist");
	cy.findByText("Cyf Admin").should("exist");
});
