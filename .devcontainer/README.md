# .devcontainer

Allows the project to be started in a [dev container] for [GitHub Codespaces] or VS Code.

- `devcontainer.json`: Defines the development environment.
- `docker-compose.yml`: Defines the services (including the dev container) - extends the root `docker-compose.yml`.
- `Dockerfile`: Defines the app's dev container (Debian, Node 18, PostgreSQL client).

## Setup

Follow the same instructions in the root README, except that:

- you can skip step 3 (as the environment variables are set for you);
- you can skip step 4 (as the services are started for you); and
- if `npx cypress verify` says Cypress isn't installed inside the container run `npx cypress install`.

If you want to connect directly to the DB, you can use `psql $DATABASE_URL`.

The environment is set up for the tests; to allow visiting the site and logging in from a local browser you need to
set the env var `OAUTH_AUTHORIZE_ENDPOINT=http://localhost:4212/login/oauth/authorize` (e.g. in a `.env` file) before
`npm run dev` or `npm run serve`.

### Codespaces login

Because of the way Codespaces work, it's even more awkward to get the login working. As above you can override the
`/authorize` endpoint, but you need to use the app's public URL:

```
OAUTH_AUTHORIZE_ENDPOINT="https://$CODESPACE_NAME-4212.preview.app.github.dev/login/oauth/authorize"
```

Now the "Log in" link will take you to right place (you may need to explicitly [forward] `gh:4212` to see the login
screen). However, this is going to try to redirect you _back_ to `http://localhost:4201`. Copy the query parameter and
visit `https://$CODESPACE_NAME-4201.preview.app.github.dev/api/auth/callback?code=<copied>` yourself.

[dev container]: https://code.visualstudio.com/docs/devcontainers/containers
[forward]: https://docs.github.com/en/codespaces/developing-in-codespaces/forwarding-ports-in-your-codespace
[github codespaces]: https://docs.github.com/en/codespaces
