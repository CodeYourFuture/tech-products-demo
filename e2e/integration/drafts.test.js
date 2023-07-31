it("lets admin users approve drafts", () => {
	const adminEmail = "admin@codeyourfuture.io";
	cy.seed("twoUsersOneResource");
	cy.request({
		headers: { Authorization: `Bearer ${Cypress.env("SUDO_TOKEN")}` },
		method: "GET",
		url: "/api/users",
	}).then(({ body }) => {
		const { id } = body.find(({ email }) => email === adminEmail);
		cy.request({
			body: { is_admin: true },
			headers: { Authorization: `Bearer ${Cypress.env("SUDO_TOKEN")}` },
			method: "PATCH",
			url: `/api/users/${id}`,
		});
	});
	cy.visit("/");
	cy.logInAs(adminEmail);
	cy.findByRole("link", { name: /drafts/i }).click();
	cy.findByText("Joi documentation").should("exist");
	cy.findByRole("button", { name: /publish/i }).click();
	cy.findByText("Joi documentation").should("not.exist");
	cy.logOut();
	cy.logInAs("shh@example.com");
	cy.findByText("Joi documentation").should(
		"have.attr",
		"href",
		"https://joi.dev/"
	);
	cy.findByRole("link", { name: /drafts/i }).should("not.exist");
});
