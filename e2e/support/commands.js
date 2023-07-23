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

Cypress.Commands.add("validateA11y", () => {
	cy.injectAxe();
	cy.checkA11y(null, null, (violations) => {
		const violationData = violations.map(
			({ id, impact, description, nodes }) => ({
				id,
				impact,
				description,
				nodes: nodes.length,
			})
		);

		cy.task("table", violationData);
	});
});
