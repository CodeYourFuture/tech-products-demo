# GitStub

A fake GitHub OAuth server (using [Fauxauth]) and API to allow login without setting up a real app.

## Users

Using the OAuth flow you can only log in as one of a set of pre-defined users. These users are configured in the `USERS` environment variable defined in the root `docker-compose.yml`.

Each user object in the array must have:

- `gitHubId`: A unique numerical GitHub ID;
- `email`: An email address, which will appear on the log-in page;

at least one of:

- `gitHubLogin`: A login (i.e. GitHub username, otherwise determined by lower- and kebab-casing their `name`); and
- `name`: Their public name (otherwise `null`); and

may optionally have:

- `publicEmail`: If `true`, the email will be available via `/api/users` (otherwise `null`); and
- `token`: their "GitHub API token" (otherwise a random UUID).

[fauxauth]: https://www.npmjs.com/package/fauxauth
