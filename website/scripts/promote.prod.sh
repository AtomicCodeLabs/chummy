# Checkout source branch first
yarn checkout:gamma
git add -A
HUSKY_SKIP_HOOKS=1 git commit -m "chore(pre-promote): push gamma"
git push -u origin website/gamma

# Checkout target branch
yarn checkout:prod
git add -A
HUSKY_SKIP_HOOKS=1 git commit -m "chore(pre-promote): push prod"
git push -u origin website/prod

# Merge
HUSKY_SKIP_HOOKS=1 git merge --no-edit -s recursive -X ours website/gamma

# Push target branch
amplify push
git push -u origin website/prod

# Return to dev branch
yarn checkout:dev
