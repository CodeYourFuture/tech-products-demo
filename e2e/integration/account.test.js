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

it("shows the authenticated user's resource", () => {
	const title = "User resource item";
	const url = "https://example.com";
	cy.visit("/");
	cy.logInAs("admin@codeyourfuture.io");
	cy.findByRole("link", { name: /suggest/i }).click();
	cy.findByRole("textbox", { name: /title/i }).type(title);
	cy.findByRole("textbox", { name: /url/i }).type(`${url}{enter}`);
	cy.findByText(/thank you for suggesting a resource/i).should("exist");
	cy.findByRole("link", { name: /account/i }).click();
	cy.findByRole("heading", { level: 2 }).should("contain.text", "My Resources");
	cy.findByRole("textbox", { name: /title/i }).should("have.value", title);
	cy.findByRole("textbox", { name: /url/i }).should("have.value", url);
	cy.findByRole("heading", { level: 4 }).should("contain.text", "☐ Draft");
	cy.findByRole("button", { name: /No more to load/i }).should("exist");
});
