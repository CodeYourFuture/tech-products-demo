#!/usr/bin/env bash

set -euo pipefail

gnuDate() {
  if type gdate > /dev/null 2>&1; then
    gdate "$@"
  else
    date "$@"
  fi
}

ONE_MONTH_AGO="$(gnuDate -d '- 1 month' +%Y-%m-%d)"

PULL_REQUESTS=$(
  gh pr list \
    --jq '.[].number' \
    --json 'number' \
    --search "updated:<=$ONE_MONTH_AGO" \
    --state 'open'
)

if [[ -z "$PULL_REQUESTS" ]]; then
  echo 'No stale PRs'
  exit 0
fi

for PR in $PULL_REQUESTS; do
  gh pr close "$PR" --comment '🍞 Closing as stale (more than one month without updates)'
done
