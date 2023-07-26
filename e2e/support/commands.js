// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import "@testing-library/cypress/add-commands";
import "cypress-axe";

Cypress.Commands.add("logInAs", (email) => {
	cy.findByRole("link", { name: /log in/i }).click();
	cy.origin(
		new URL(Cypress.env("OAUTH_URL")).origin,
		{ args: { email } },
		({ email }) => {
			cy.get("#role-select").select(email);
			cy.get("#submit-button").click();
		}
	);
});

Cypress.Commands.add("seed", (fixture) => {
	cy.fixture(fixture).then((data) => cy.task("seed", data));
});

Cypress.Commands.add("validateA11y", () => {
	cy.injectAxe();
	cy.checkA11y(
		null,
		{ runOnly: { type: "tag", values: ["wcag2a", "wcag2aa"] } },
		(violations) => {
			const violationData = violations.map(
				({ id, impact, description, nodes }) => ({
					id,
					impact,
					description,
					nodes: nodes.length,
				})
			);

			cy.task("table", violationData);
		}
	);
});
