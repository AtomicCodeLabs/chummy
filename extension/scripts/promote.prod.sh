# Checkout source branch first
yarn checkout:gamma
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