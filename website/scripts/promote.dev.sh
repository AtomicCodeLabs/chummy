# Checkout source branch first
yarn checkout:dev
git add -A
HUSKY_SKIP_HOOKS=1 git commit -m "chore(pre-promote): push dev [skip-cd]"
git push -u origin website/dev

# Push backend
amplify push