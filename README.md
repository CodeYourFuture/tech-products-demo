# Tech Products Demo

[![Node.js CI](https://github.com/CodeYourFuture/tech-products-demo/workflows/Node.js%20CI/badge.svg)](https://github.com/CodeYourFuture/tech-products-demo/actions)

## Dev Setup

The prerequisites are:

- Node and NPM (see `engines` field in `package.json` for compatible versions)
- Docker Compose

If you're using [dev containers], see `.devcontainer/README.md`. Otherwise:

1. [Fork] the repository to your account
   - Un-tick "Copy the `main` branch only" to get all the branches in your fork
2. Clone your fork
3. Run `npm ci` to install the dependencies
4. Copy `e2e/.env` to `.env` and update as needed
5. Run `npm run services:start` to start the services
6. Run `npm run migration -- up` to migrate the database
7. Run `npm run ship` to ensure that the tests pass
8. Start the app with `npm run dev` (dev mode) or `npm run serve` (prod mode) and visit:
   - UI: http://localhost:4201
   - API docs: http://localhost:4201/docs

From there see `.github/CONTRIBUTING.md` for details on recommended workflows.

### Ports used

- 4201: client application (Webpack in dev mode, Express in production mode)
- 4202: Express server (dev mode only)
- 4211: Postgres
- 4212: GitStub (mock GitHub OAuth/API)

[dev containers]: https://code.visualstudio.com/docs/devcontainers/containers
[fork]: https://docs.github.com/en/get-started/quickstart/fork-a-repo
