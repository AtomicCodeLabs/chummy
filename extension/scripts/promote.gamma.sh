# Checkout source branch first
yarn checkout:dev
git add -A
HUSKY_SKIP_HOOKS=1 git commit -m "chore(pre-promote): push dev"
git push -u origin extension/dev

# Checkout target branch
yarn checkout:gamma
git add -A
HUSKY_SKIP_HOOKS=1 git commit -m "chore(pre-promote): push gamma"
git push -u origin extension/dev

# Merge
git merge --squash extension/dev

# Push target branch
amplify push
git push -u origin extension/gamma

# Return to dev branch
yarn checkout:dev
