#!/bin/bash
set -ex

# Copy all the assets.
# TODO: Make /otherjs/* immutable.
aws --region=us-west-2 s3 sync --acl public-read --exclude ".*" ./dist/ s3://apps.other.chat/

# Create semantic version redirects.
# TODO: Cache for 24hrs.
VERSION=`grep -o '"version": "[^"]*"' package.json | cut -d'"' -f4`
MAJOR=`echo $VERSION | cut -d. -f1`
MINOR=`echo $VERSION | cut -d. -f2`
REVISION=`git rev-parse --short HEAD`
aws --region=us-west-2 s3api put-object --bucket apps.other.chat --acl public-read --key otherjs/$MAJOR.$MINOR.x/other.min.js --website-redirect-location /otherjs/$VERSION+$REVISION/other.min.js --content-type application/javascript
aws --region=us-west-2 s3api put-object --bucket apps.other.chat --acl public-read --key otherjs/$MAJOR.x/other.min.js --website-redirect-location /otherjs/$VERSION+$REVISION/other.min.js --content-type application/javascript
