# Tech Products Demo

[![Node.js CI](https://github.com/CodeYourFuture/tech-products-demo/workflows/Node.js%20CI/badge.svg)](https://github.com/CodeYourFuture/tech-products-demo/actions)

## Dev Setup

- Clone the repository
- Run `npm ci` to install the dependencies
- Run `docker compose up --detach` to start the services
- Copy `.env.example` to `.env` and update if needed
- Run `npm run migration -- up` to migrate the database
- Run `npm run ship` to ensure all of the tests pass
- Start the app with `npm run dev` (dev mode) or `npm run serve` (prod mode) and visit:
  - UI: http://localhost:4201
  - API docs: http://localhost:4201/docs

### Ports used

- 4201: client application (Webpack in dev mode, Express in production mode)
- 4202: Express server (dev mode only)
- 4211: Postgres

### Workspaces

This project uses NPM [workspaces] to separate the different parts of the system:

- `client`: The frontend React app and associated Webpack configuration;
- `e2e`: The Cypress E2E tests; and
- `server`: The backend Express app.

If you need to run NPM commands in these workspaces, you can use the `-w`/`--workspace` flag, e.g. to install a new
dependency needed in the React build:

```shell
$ npm --workspace client install --save-dev <dependency>
```

**Note**: only dependencies needed by the `server` workspace at runtime should be non-`dev` dependencies.

[workspaces]: https://docs.npmjs.com/cli/v8/using-npm/workspaces
