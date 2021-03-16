#!/bin/bash

cd $CODEBUILD_SRC_DIR/extension/dist
ls
pwd

VERSION=$(cat ".version")
STAGE=$1

zip -r dist_$VERSION.web.zip web
aws s3 cp dist_$VERSION.web.zip s3://chummy-assets-$STAGE/$VERSION/

cd moz
zip -r ../dist_$VERSION.moz.zip .
cd ..
aws s3 cp dist_$VERSION.moz.zip s3://chummy-assets-$STAGE/$VERSION/

cd $CODEBUILD_SRC_DIR/extension
