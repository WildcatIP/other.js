#!/bin/bash
set -ex

# Copy all the assets.
# TODO: Make /otherjs/* immutable.
aws --region=us-west-2 s3 sync --acl public-read --exclude ".*" ./dist/ s3://apps.other.chat/

# Create semantic version redirects.
VERSION=`grep -o '"version": "[^"]*"' package.json | cut -d'"' -f4`
MAJOR=`echo $VERSION | cut -d. -f1`
MINOR=`echo $VERSION | cut -d. -f2`
REVISION=`git rev-parse --short HEAD`
cd dist/otherjs/$VERSION+$REVISION
for FILE in *
do
  aws --region=us-west-2 s3api put-object --bucket apps.other.chat --acl public-read --key otherjs/$MAJOR.$MINOR.x/$FILE --website-redirect-location /otherjs/$VERSION+$REVISION/$FILE --content-type application/javascript --cache-control "max-age=86400, public"
  aws --region=us-west-2 s3api put-object --bucket apps.other.chat --acl public-read --key otherjs/$MAJOR.x/$FILE --website-redirect-location /otherjs/$VERSION+$REVISION/$FILE --content-type application/javascript --cache-control "max-age=86400, public"
done
