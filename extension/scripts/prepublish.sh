cd $CODEBUILD_SRC_DIR/extension/dist
pwd

VERSION=$(cat ".version")
STAGE=$1

# Pushing to
for filename in web/{popup_$VERSION,background.dao_$VERSION}*.js; do
  echo "Pushing $filename to s3://chummy-assets-$STAGE/$VERSION/"
  aws s3 cp $filename s3://chummy-assets-$STAGE/$VERSION/
done

cd $CODEBUILD_SRC_DIR/extension
