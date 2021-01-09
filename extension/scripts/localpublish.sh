#!/bin/bash

cd dist
ls
pwd

VERSION=$(cat ".version")

aws s3 cp gamma.web.cloud/background.dao_$VERSION.js s3://chummy-assets-gamma/$VERSION/
aws s3 cp gamma.web.cloud/popup_$VERSION.js s3://chummy-assets-gamma/$VERSION/

zip -r dist_$VERSION.web.cloud.zip gamma.web.cloud
aws s3 cp dist_$VERSION.web.cloud.zip s3://chummy-assets-gamma/$VERSION/

cd ..
