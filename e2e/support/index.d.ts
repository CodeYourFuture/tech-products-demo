// @ts-ignore
declare global {
	namespace Cypress {
		interface Chainable {
			/**
			 * Go through the OAuth loop for the specified user.
			 * @param {string} email - should match a user in the GitStub service
			 */
			logInAs(email: string): Chainable;

			/**
			 * Seed the database with the specified fixture.
			 * @param {string} fixture - name of the fixture file to use
			 */
			seed(fixture: string): Chainable;

			/**
			 * Inject Cypress Axe and check basic accessibility.
			 */
			validateA11y(): Chainable;
		}
	}
}
