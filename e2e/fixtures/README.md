# E2E fixtures

Pre-prepared data for use in the E2E tests. These files can be accessed with [`cy.fixture`][cy.fixture], when
[stubbing network requests] or our custom `cy.seed` command (see below).

## Database seeds

Correctly-formatted files can be used to get the database into a known state. To use with `cy.seed`:

- The fixture must be a JSON file exporting an object.
- Each property in the object must be the name of a table and its value must be an array of objects.
- Each property of every object in the array must be the name of a column in that table.

Given the following file:

```json5
// e2e/fixtures/myFixture.json
{
	"<table name>": [
		{
			"<column name>": "<value>",
			// ...
		},
		// ...
	],
	// ...
}
```

you could load it into the DB for the current test using:

```javascript
cy.seed("myFixture"); // loads the above fixture into the DB for the current test
```

[cy.fixture]: https://docs.cypress.io/api/commands/fixture
[stubbing network requests]: https://docs.cypress.io/guides/guides/network-requests#Fixtures
