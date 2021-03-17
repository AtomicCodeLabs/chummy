#!/bin/bash

cd $CODEBUILD_SRC_DIR/extension/dist
ls
pwd

VERSION=$(cat ".version")
STAGE=$1

zip -r dist_$VERSION.chrome.zip chrome
aws s3 cp dist_$VERSION.chrome.zip s3://chummy-assets-$STAGE/$VERSION/

zip -r dist_$VERSION.edge.zip edge
aws s3 cp dist_$VERSION.edge.zip s3://chummy-assets-$STAGE/$VERSION/

zip -r dist_$VERSION.opera.zip opera
aws s3 cp dist_$VERSION.opera.zip s3://chummy-assets-$STAGE/$VERSION/

cd moz
zip -r ../dist_$VERSION.moz.zip .
cd ..
aws s3 cp dist_$VERSION.moz.zip s3://chummy-assets-$STAGE/$VERSION/

cd $CODEBUILD_SRC_DIR/extension
