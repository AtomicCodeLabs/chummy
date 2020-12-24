VERSION=$1

cd dist
aws s3 cp web/popup_$VERSION.js s3://chummy-assets/$VERSION/
aws s3 cp web/background.dao_$VERSION.js s3://chummy-assets/$VERSION/
