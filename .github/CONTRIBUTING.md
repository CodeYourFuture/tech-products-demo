# Contributing

In general, a _"test-driven development"_ (TDD) approach is recommended. Not all of these steps will be needed for every story, but a workflow might look something like:

- Create a new branch for your feature from `main` (e.g. `feature/short-description`).
- Start with an end-to-end (E2E) test with [Cypress] to describe how the feature should behave from an end-user's perspective.
- Then move down to the API:
  - Update the [Swagger] documentation in `server/docs/` to reflect any new or changed endpoints required by the proposed functionality.
  - Create a [node-pg-migrate] migration to update the database schema (e.g. adding a new table, or a new column to an existing one).
  - Drive out the functionality needed in the API by writing integration tests with [Jest] and [SuperTest].
  - Implement [Express] endpoints
- Next the [React] UI:
  - Test-drive updates to or creation of `use<Thing>Service` hooks to allow components to access the updated API using [Jest] and [MSW].
  - Create the pages (with [React Router] routes) and components required, testing them with [Jest] and [React Testing Library].
  - Apply classes and styles to polish the visual appearance of the new pages and components.
- Make a commit.
- Run `npm run ship` to apply the full automated quality checking suite and ensure everything still works.
  - Compare the coverage report to the GitHub Pages site in the repo, which shows the current coverage on `main`, to ensure it's not falling too much (and is ideally rising!)
- `git push` the changes and open a pull request, following the guidance in the template.

You can see examples of all of the above in the codebase and the pull requests on the repository. Proceeding in this way gives plenty of chances to check in for guidance, e.g. _"does this E2E test reflect your understanding of the user flow"_, or _"do you think this Swagger API design is sensible?"_, before too much work has been done on a possibly-incorrect implementation.

## Create a test environment

### Deploy

A `render.yaml` file is provided to allow you to deploy a test environment, comprising the app itself and a Postgres database, to [Render]. To do this:

- Log in to the Render Dashboard using GitHub
- Make sure Render has access to at least your fork of the repo (or give it access to all repos in your account)
- Click the "New" button and select "Blueprint"
- Click the "Connect" button on your fork of the repo
  - Name it something like `{your-github-login}-tech-products-demo`
  - Click "Generate" for all three environment variables (make sure to note the value of `SUDO_TOKEN` down)
    - Note the `OAUTH_` values won't actually be correct, but they're needed for the app to start; we'll update them soon
  - Click "Apply"

Once the deployment succeeds you should have a URL like `https://tech-products-demo-abc123.onrender.com`, let's call this `$URL`.

Update the repository's "About" section in GitHub to use this `$URL` instead of the upstream's Heroku URL.

You can see the current environment variables for your app in Dashboard -> `tech-products-demo` Web Service -> Environment.

### OAuth

Create a new [GitHub OAuth] application.

- Enter `{your name} Tech Products Demo` for the **Application name**
- Enter the `{$URL}` for the **Homepage URL**
- Enter `{$URL}/api/auth/callback` for the **Authorization callback URL**

You will now see a client ID; use this value for the `OAUTH_CLIENT_ID` environment variable in Render.

Click "Generate a client secret" in GitHub. You will now see a client secret; use this value for the `OAUTH_CLIENT_SECRET` environment variable in Render.

Click "Save Changes" in Render. This will trigger a redeployment. When it finishes you should be able to visit `$URL` and log into your app using GitHub!

Whenever you push changes to your `main` branch, this site will be automatically redeployed. You can check which commit is deployed at any time by visiting `{$URL}/build-info.txt`.

## End-to-end tests

The end-to-end tests use [Cypress] and can be found in the `e2e/` directory. As well as the default commands offered by Cypress, there are:

- custom commands as described in `e2e/support/index.d.ts` (implementations are in `e2e/support/commands.js`); and
- [Cypress Testing Library] is provided (using these selectors rather than e.g. `cy.get(...)` is **strongly recommended** to help support accessibility, see the Testing Library docs on [query priority]).

One very important thing to understand is that, although Cypress does use `.then`, they're **not promises**. The way it handles asynchronous operations is described in [this article][cypress variables and aliases] from their documentation.

### Database seeds

The files in `e2e/fixtures/` can be accessed:

- with [`cy.fixture`][cy.fixture] inside a test;
- when [stubbing network requests][cypress stub]; and
- when using the custom `cy.seed` command to get the database into a known state.

To use a fixture with `cy.seed`:

- The fixture must be a JSON file representing an object.
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

## Server

### Migrations

Migrations are used to update the schema of the database in an automated way, so the tables and columns can evolve to meet the needs of new functionality without having to do manual work synchronising database states.

- Run `npm run migration -- create 'short description'` to create a new migration file in `migrations/` (with a timestamp and kebab-cased description as its name).
  - Fill in at least the `up` migration; some `down` migrations can be generated automatically (e.g. `createTable` -> `dropTable`) so you may be able to leave this blank.
  - The `"uuid"` type is provided as a "shorthand" to the default ID column used in tables.
- Apply the migration (and any other pending migrations) with `npm run prestart` or `npm run migration -- up`.
- Check it can be reversed and reapplied (i.e. both up and down work) with `npm run migration -- redo`.
  - The actual queries that were run will be logged out, review these to ensure they're doing what you intended.

These will then be run automatically in production environments when the app is released, to ensure the DB supports the deployed functionality without having to directly access the live instance.

### API documentation

The [Swagger] docs defined in `server/docs/` are developer-facing documentation, visible at http://localhost:4201/docs when the app is running. They describe each available endpoint in terms of the request (including the method and any path, query or body parameters) and the expected responses (including any body or headers).

For a new feature, you'll probably:

- Add or update `<thing>.yml` files to describe each endpoint; using
- Shared definitions in `schema.yml`.

If you're unfamiliar with YAML start with https://learnxinyminutes.com/docs/yaml/.

### Structure

Each group of endpoints is its own `<thing>/` directory in `server/`, containing:

- `index.js` - default exports the router from the controller and named exports the service;
- `<thing>.test.js` - API integration tests (see below);
- `<thing>Controller.js` - deals with the HTTP layer, handling requests;
- `<thing>Service.js` - describes the business logic; and
- `<thing>Repository.js` - defines functions for reading from and writing to the database.

A rule of thumb for correctly structuring an endpoint directory is:

- The controller and repository may import from the service, but not the other way around;
- If services from other modules are needed, they're imported only into the service;
- Express/HTTP is only mentioned in the controller; and
- Postgres/SQL is only mentioned in the repository.

### API integration tests

The backend is currently tested with API integration tests, making requests and checking that the responses are as expected. These can be quite complex, as it may require several requests to get the app set up in the correct state (e.g. the `authenticateAs` helper does up to five requests, plus you may need to create resources, etc.). Remember to build up the required functionality piece by piece, starting with the core "happy path" but also including the validation.

## Client

Implementing a new feature in the client will generally involve:

- Routes defined in `client/src/App.js`, rendering;
- Pages defined in `client/src/pages/`, using;
- Services defined in `client/src/services/`, to get data for;
- Components defined in `client/src/components/`.

### Authentication

The authentication with the backend is all dealt with automatically. This means you can largely ignore it when developing and writing unit/integration tests for the client code.

- The Express server sets a session cookie, which is added to requests by the browser.
- `client/src/authContext.js` checks whether the user is logged in before loading the rest of the app.
- The services use a wrapper around fetch that automatically logs the user back out and (if they were on a protected page) sends them to the home page if any request responds 401 Unauthorized.

You can get access to the currently-authenticated user with the `usePrincipal` hook (it will return `undefined` if the user is a guest).

### Styling

The app is set up to use regular CSS files or [SCSS] (the latter allows nesting rules). Layout is mostly done with [Flexbox]. Responsive design should be desktop-first (~1,024px width), with breakpoints for smaller devices as needed.

[cypress]: https://www.cypress.io/
[cypress task]: https://docs.cypress.io/guides/tooling/plugins-guide#cytask
[cy.fixture]: https://docs.cypress.io/api/commands/fixture
[cypress stub]: https://docs.cypress.io/guides/guides/network-requests#Fixtures
[cypress testing library]: https://testing-library.com/docs/cypress-testing-library/intro/
[cypress variables and aliases]: https://docs.cypress.io/guides/core-concepts/variables-and-aliases
[express]: https://expressjs.com/
[flexbox]: https://css-tricks.com/snippets/css/a-guide-to-flexbox/
[github oauth]: https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app
[jest]: https://jestjs.io/
[msw]: https://jestjs.io/
[node-pg-migrate]: https://salsita.github.io/node-pg-migrate/#/
[query priority]: https://testing-library.com/docs/queries/about/#priority
[react]: https://react.dev/
[react router]: https://reactrouter.com/en/main
[react testing library]: https://testing-library.com/docs/react-testing-library/intro/
[render]: https://render.com/
[scss]: https://sass-lang.com/documentation/syntax/#scss
[supertest]: https://www.npmjs.com/package/supertest
[swagger]: https://swagger.io/docs/specification/about/
