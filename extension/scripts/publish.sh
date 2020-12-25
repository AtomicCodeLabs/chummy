cd dist

VERSION=$(cat ".version")
STAGE=$1

zip -r dist_$VERSION.moz.zip moz
aws s3 cp dist_$VERSION.moz.zip s3://chummy-assets-$STAGE/$VERSION/

zip -r dist_$VERSION.web.zip web
aws s3 cp dist_$VERSION.web.zip s3://chummy-assets-$STAGE/$VERSION/
