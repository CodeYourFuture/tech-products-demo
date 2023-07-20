# Tech Products Demo

[![Node.js CI](https://github.com/CodeYourFuture/tech-products-demo/workflows/Node.js%20CI/badge.svg)](https://github.com/CodeYourFuture/tech-products-demo/actions)

## Dev Setup

- Clone the repository
- Run `npm ci` to install the dependencies
- Run `docker compose up --detach` to start the services
- Copy `.env.example` to `.env` and update if needed
- Run `npm run migration -- up` to migrate the database
- Run `npm run ship` to ensure all of the tests pass
- Start the app with `npm run dev` (dev mode) or `npm run serve` (prod mode) and visit http://localhost:4201

### Ports used

- 4201: client application (Webpack in dev mode, Express in production mode)
- 4202: Express server (dev mode only)
- 4211: Postgres
