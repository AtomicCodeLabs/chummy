# Checkout source branch first
yarn checkout:dev
git push -u extension/dev

# Checkout target branch
yarn checkout:gamma

# Merge
git merge extension/dev

# Push target branch
amplify push
git push -u origin extension/gamma

# Return to dev branch
yarn checkout:dev