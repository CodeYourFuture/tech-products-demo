# .devcontainer

Allows the project to be started in a [dev container] for GitHub Codespaces or VS Code.

- `devcontainer.json`: Defines the development environment.
- `docker-compose.yml`: Defines the services (including the dev container) - extends the root `docker-compose.yml`.
- `Dockerfile`: Defines the app's dev container (Debian, Node 18, PostgreSQL client).

## Setup

Follow the same instructions in the root README, except that:

- you can skip step 3 (as the services are started for you); and
- if `npx cypress verify` says Cypress isn't installed inside the container run `npx cypress install`.

If you want to connect directly to the DB, you can use `psql $DATABASE_URL`.

[dev container]: https://code.visualstudio.com/docs/devcontainers/containers
