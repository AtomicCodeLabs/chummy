cd dist

VERSION=$(cat ".version")

# Pushing to
for filename in web/{popup_$VERSION,background.dao_$VERSION}*.js; do
  echo "Pushing $filename to s3://chummy-assets/$VERSION"
  # aws s3 cp $filename s3://chummy-assets/$VERSION/
done
