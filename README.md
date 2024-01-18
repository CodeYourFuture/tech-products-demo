# Tech Products Demo

[![Node.js CI](https://github.com/CodeYourFuture/tech-products-demo/workflows/Node.js%20CI/badge.svg)](https://github.com/CodeYourFuture/tech-products-demo/actions)

This is a "work sample simulation", an experience of what it's like to work in one of our teams. This gives you the opportunity to both demonstrate the skills you'd bring to the role and decide whether the role is something you'd enjoy doing.

Follow the instructions [below](#dev-setup) to create a fork, clone it and get your local dev environment set up.

There are two tasks, corresponding to the main tasks developers in our teams carry out; you may do them in either order. If you have any problems, feel free to ask questions in [#join-cyf-tech-products](https://codeyourfuture.slack.com/archives/C05AAMJSAKC); that's also part of the simulation!

## Review a PR

- In your fork, create a PR from `feature/resource-page` to `main`, using the content of `pull_request.md` as the description
- Check out that branch locally so you can run the scripts and try out the functionality
  - If you've made any database updates, run `npm run migration -- down` to roll them back _before_ checking out the branch
  - If you've made any dependency updates, re-run `npm ci` _after_ checking out the branch
- Carry out a review of the pull request in GitHub, adding comments to the implementation and deciding whether it's ready to merge ("Approve") or not ("Request changes")
  - **Note**: as the `main` branch is maintained some conflicts/out of date warnings may appear in GitHub, you can ignore these as out-of-scope for the review

## Create a PR

- Look through the [backlog][unblocked-features] and select an un-blocked open feature to complete
  - Think about how you can best demonstrate your skills - does the feature require shiny new UI, updates to the backend logic, or a mix of both?
- Implement the feature you've selected, following the guidance in [`.github/CONTRIBUTING.md`][contributing]
  - Remember this is a simulation of working in the team - try to follow the patterns already established in the codebase
- Look at [previous examples][merged-prs] to get an idea of what a PR should look like

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

From there see [`.github/CONTRIBUTING.md`][contributing] for details on recommended workflows.

### Ports used

- 4201: client application (Vite in dev mode, Express in production mode)
- 4202: Express server (dev mode only)
- 4211: Postgres
- 4212: GitStub (mock GitHub OAuth/API)

[contributing]: .github/CONTRIBUTING.md
[dev containers]: https://code.visualstudio.com/docs/devcontainers/containers
[fork]: https://docs.github.com/en/get-started/quickstart/fork-a-repo
[merged-prs]: https://github.com/CodeYourFuture/tech-products-demo/pulls?q=is%3Apr+is%3Amerged+
[unblocked-features]: https://github.com/CodeYourFuture/tech-products-demo/issues?q=is%3Aopen+is%3Aissue+-label%3Ablocked+label%3A%22%3Asparkles%3A+feature%22
