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
	cy.findByRole("heading", { level: 3 }).should("contain.text", title);
	cy.findByRole("link", { name: "example.com" }).should(
		"have.attr",
		"href",
		url
	);
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

it("gives feedback if the resource already exists", () => {
	const title = "Another useful item";
	const url = "https://example.com";
	cy.visit("/");
	cy.logInAs("shh@example.com");
	cy.findByRole("link", { name: /suggest/i }).click();

	cy.findByRole("textbox", { name: /title/i }).type(title);
	cy.findByRole("textbox", { name: /url/i }).type(`${url}{enter}`);
	cy.findByText(/thank you for suggesting a resource/i).should("exist");

	cy.findByRole("textbox", { name: /title/i }).type(title);
	cy.findByRole("textbox", { name: /url/i }).type(`${url}{enter}`);
	cy.findByText(/a very similar resource already exists/i).should("exist");
	cy.findByRole("textbox", { name: /title/i }).should("have.value", title);
	cy.findByRole("textbox", { name: /url/i }).should("have.value", url);
});

it("lets the suggester assign a topic to the resource", () => {
	cy.seed("admin");
	cy.visit("/");

	cy.logInAs("shh@example.com");
	cy.findByRole("link", { name: /suggest/i }).click();
	cy.findByRole("textbox", { name: /title/i }).type(
		"A Complete Guide to Flexbox"
	);
	cy.findByRole("textbox", { name: /url/i }).type(
		"https://css-tricks.com/snippets/css/a-guide-to-flexbox/"
	);
	cy.findByRole("combobox", { name: /topic/i }).select("HTML/CSS");
	cy.findByRole("button", { name: /suggest/i }).click();
	cy.findByText(/thank you for suggesting a resource/i).should("exist");
	cy.logOut();

	cy.logInAs("admin@codeyourfuture.io");
	cy.findByRole("link", { name: /drafts/i }).click();
	cy.findByText("HTML/CSS").should("exist");
	cy.findByRole("button", { name: /publish/i }).click();
	cy.findByRole("heading", { level: 1 }).click();
	cy.findByRole("combobox", { name: /filter topic/i }).should("exist");
});
