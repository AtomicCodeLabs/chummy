#!/bin/bash

cd dist.prod
ls
pwd

VERSION=$(cat "../.version")

mkdir $VERSION
cd $VERSION
aws s3 cp s3://chummy-assets-prod/$VERSION/ . --recursive

cd ../..
