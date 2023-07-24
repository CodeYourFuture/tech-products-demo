# Tech Products Demo

[![Node.js CI](https://github.com/CodeYourFuture/tech-products-demo/workflows/Node.js%20CI/badge.svg)](https://github.com/CodeYourFuture/tech-products-demo/actions)

## Dev Setup

If you're using devcontainers, see `.devcontainer/README.md`. Otherwise:

1. Clone the repository
2. Run `npm ci` to install the dependencies
3. Run `docker compose up --detach` to start the services
4. Copy `.env.example` to `.env` and update if needed
5. Run `npm run migration -- up` to migrate the database
6. Run `npm run ship` to ensure all of the tests pass
7. Start the app with `npm run dev` (dev mode) or `npm run serve` (prod mode) and visit:
   - UI: http://localhost:4201
   - API docs: http://localhost:4201/docs

### Ports used

- 4201: client application (Webpack in dev mode, Express in production mode)
- 4202: Express server (dev mode only)
- 4211: Postgres
