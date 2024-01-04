# Scripts

The following executable scripts are provided:

- `close-stale.sh`: Used on a weekly basis to clear out stale Pull Requests
- `run-migrations.js`: Called on `prestart` to ensure all migrations are applied to the configured database
  - **Note**: using `node-pg-migrate`'s own executable limits the configuration options, this is provided so that the SSL settings required in Heroku can be applied
- `up-to-date.sh`: Updates all NPM dependencies to the latest compatible versions, tests the result, then commits and pushes if everything is fine
