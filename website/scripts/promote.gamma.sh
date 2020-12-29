# Checkout source branch first
yarn checkout:dev
git add -A
HUSKY_SKIP_HOOKS=1 git commit -m "chore(pre-promote): push dev [skip-cd]"
git push -u origin website/dev

# Checkout target branch
yarn checkout:gamma
git add -A
HUSKY_SKIP_HOOKS=1 git commit -m "chore(pre-promote): push gamma [skip-cd]"
git push -u origin website/gamma

# Merge
HUSKY_SKIP_HOOKS=1 git merge --no-edit -s recursive -X ours website/dev

# Push target branch
amplify push
git push -u origin website/gamma

# Return to dev branch
yarn checkout:dev
