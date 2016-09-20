#!/bin/bash
set -ex

NPM_PACKAGE=$(npm pack)

# Copy all features (cacheable for 1 day).
aws --region=us-west-2 s3 sync --acl public-read --cache-control "max-age=86400, public" --exclude "otherjs/*" ./dist/ s3://apps.other.chat/

# Copy the library (cachable for 1 year).
aws --region=us-west-2 s3 sync --acl public-read --cache-control "max-age=31536000, public" ./dist/otherjs/ s3://apps.other.chat/otherjs/
aws --region=us-west-2 s3 cp --acl public-read --cache-control "max-age=31536000, public" ${NPM_PACKAGE} s3://apps.other.chat/otherjs/

# Create semantic version redirects (cachable for 24 hours).
VERSION=$(grep -o '"version": "[^"]*"' package.json | cut -d'"' -f4)
MAJOR=$(echo $VERSION | cut -d. -f1)
MINOR=$(echo $VERSION | cut -d. -f2)
PATCH=$(echo $VERSION | cut -d. -f3)
REVISION=$(git rev-parse --short HEAD)
cd dist/otherjs/${VERSION}+${REVISION}
for FILE in *
do
  aws --region=us-west-2 s3api put-object --bucket apps.other.chat --acl public-read --key otherjs/${MAJOR}.${MINOR}.${PATCH}/${FILE} --website-redirect-location /otherjs/${VERSION}+${REVISION}/${FILE} --content-type application/javascript --cache-control "max-age=86400, public"
  aws --region=us-west-2 s3api put-object --bucket apps.other.chat --acl public-read --key otherjs/${MAJOR}.${MINOR}.x/${FILE} --website-redirect-location /otherjs/${VERSION}+${REVISION}/${FILE} --content-type application/javascript --cache-control "max-age=86400, public"
  aws --region=us-west-2 s3api put-object --bucket apps.other.chat --acl public-read --key otherjs/${MAJOR}.x/${FILE} --website-redirect-location /otherjs/${VERSION}+${REVISION}/${FILE} --content-type application/javascript --cache-control "max-age=86400, public"
done
