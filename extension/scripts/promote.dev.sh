#!/bin/bash
set -e

# Checkout source branch first
yarn checkout:dev
git add -A
git diff-index --quiet HEAD || HUSKY_SKIP_HOOKS=1 git commit -m "chore(pre-promote): push dev"
git push -u origin extension/dev

# Push backend
amplify push
