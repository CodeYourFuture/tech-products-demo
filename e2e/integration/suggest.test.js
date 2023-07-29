beforeEach(() => {
	cy.task("clearDb");
});

it("is not accessible to anonymous users", () => {
	cy.intercept("GET", "/api/auth/principal").as("initialRequest");
	cy.visit("/");
	cy.wait("@initialRequest");
	cy.findByRole("link", { name: /suggest/i }).should("not.exist");
});

it("meets basic accessibility guidelines", () => {
	cy.visit("/");
	cy.logInAs("admin@codeyourfuture.io");
	cy.visit("/suggest");
	cy.validateA11y();
});

it("lets an authenticated user suggest a resource", () => {
	cy.visit("/");
	cy.logInAs("shh@example.com");
	cy.findByRole("link", { name: /suggest/i }).click();
	const now = new Date().toISOString();
	const description = "This is a useful thing to read.";
	const title = `Resource from ${now}`;
	const url = `https://example.com/${now}`;
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

it("lets an authenticated user submit a resource without a description", () => {
	cy.visit("/");
	cy.logInAs("shh@example.com");
	cy.findByRole("link", { name: /suggest/i }).click();
	cy.findByRole("textbox", { name: /title/i }).type("Another useful item");
	cy.findByRole("textbox", { name: /url/i }).type("https://example.com{enter}");
	cy.findByText(/thank you for suggesting a resource/i).should("exist");
});
