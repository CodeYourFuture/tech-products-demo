# API documentation

`server/docs/` contains the developer-facing API documentation, written using Swagger/OpenAPI in YAML.

In the dev environment, it will be available at http://localhost:4201/docs.

For more information on Swagger/OpenAPI, see: https://swagger.io/docs/specification/about/

In practice you'll probably:

- Ignore `index.js`;
- Add new schemas to and refer to existing schemas from `schema.yml`; and
- Add and update `{endpoint}.yml` as needed.

## `index.js`

Creates the router that serves the docs via Express and loads the YAML files.

## `schema.yml`

Contains reusable schemas describing objects in our API for the individual endpoints to use.

## `{endpoint}.yml`

Describes a specific endpoint's requests and responses.
