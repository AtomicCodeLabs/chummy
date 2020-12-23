# Checkout source branch first
yarn checkout:gamma
git add -A
HUSKY_SKIP_HOOKS=1 git commit -m "chore(pre-promote): gamma -> prod"
git push -u origin extension/gamma

# Checkout target branch
yarn checkout:prod

# Merge
git merge --squash extension/gamma

# Push target branch
amplify push
git push -u origin extension/prod

# Return to dev branch
yarn checkout:dev
