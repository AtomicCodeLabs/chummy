#!/bin/bash
set -e

# Checkout source branch first
yarn checkout:gamma
git add -A
git diff-index --quiet HEAD || HUSKY_SKIP_HOOKS=1 git commit -m "chore(pre-promote): push gamma"
git push --follow-tags -u origin extension/gamma

# Checkout target branch
yarn checkout:prod
git add -A
git diff-index --quiet HEAD || HUSKY_SKIP_HOOKS=1 git commit -m "chore(pre-promote): push prod"
git push --follow-tags -u origin extension/prod

# Merge
HUSKY_SKIP_HOOKS=1 git merge --no-edit -s recursive -X ours extension/gamma

# Push target branch
amplify push
git push --follow-tags -u origin extension/prod

# Return to dev branch
yarn checkout:dev
