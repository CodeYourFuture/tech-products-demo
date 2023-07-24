# .devcontainer

Allows the project to be started in a [dev container] for GitHub Codespaces or VS Code.

- `devcontainer.json`: Defines the development environment.
- `docker-compose.yml`: Defines the services (including the dev container) - extends the root `docker-compose.yml`.
- `Dockerfile`: Defines the app's dev container (Debian, Node 18, PostgreSQL client).

## Setup

Follow the same instructions in the root README, except that:

- you can skip step 4 as `.env.example` is loaded automatically; and
- you may need to `npx cypress install` to install Cypress inside the container.

If you want to connect directly to the DB, you can use `psql $DATABASE_URL`.

[dev container]: https://code.visualstudio.com/docs/devcontainers/containers
