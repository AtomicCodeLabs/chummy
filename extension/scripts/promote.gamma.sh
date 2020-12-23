# Checkout source branch first
yarn checkout:dev
git add -A
git commit -m "chore(promote): pre-promote dev to gamma" &
PID=$!
sleep 1
kill $PID

git push -u origin extension/dev

# Checkout target branch
yarn checkout:gamma

# Merge
git merge --squash extension/dev

# Push target branch
amplify push
git push -u origin extension/gamma

# Return to dev branch
yarn checkout:dev
