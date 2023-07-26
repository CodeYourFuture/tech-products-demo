# .devcontainer

Allows the project to be started in a [dev container] for GitHub Codespaces\* or VS Code.

- `devcontainer.json`: Defines the development environment.
- `docker-compose.yml`: Defines the services (including the dev container) - extends the root `docker-compose.yml`.
- `Dockerfile`: Defines the app's dev container (Debian, Node 18, PostgreSQL client).

\* _OAuth login doesn't currently work in the remote browser env._

## Setup

Follow the same instructions in the root README, except that:

- you can skip step 4 (as the services are started for you); and
- if `npx cypress verify` says Cypress isn't installed inside the container run `npx cypress install`.

If you want to connect directly to the DB, you can use `psql $DATABASE_URL`.

The environment is set up for the tests, to allow visiting the site and logging in from a local browser you need to
set the env var `OAUTH_AUTHORIZE_ENDPOINT=http://localhost:4212/login/oauth/authorize` before `npm run dev` or
`npm run serve`.

[dev container]: https://code.visualstudio.com/docs/devcontainers/containers
