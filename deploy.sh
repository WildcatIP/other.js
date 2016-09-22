#!/bin/bash
set -ex

NPM_PACKAGE=$(npm pack)

# Copy all features (cacheable for 1 day).
aws --region=us-west-2 s3 sync --acl public-read --cache-control "max-age=86400, public" --exclude "otherjs/*" ./dist/ s3://apps.other.chat/

# Copy the library (cachable for 1 year).
aws --region=us-west-2 s3 sync --acl public-read --cache-control "max-age=31536000, public" ./dist/otherjs/ s3://apps.other.chat/otherjs/

# Copy the npm package (not cachable).
aws --region=us-west-2 s3 cp --acl public-read --cache-control "no-cache, no-store, must-revalidate" --expires 0 ${NPM_PACKAGE} s3://apps.other.chat/otherjs/

# Create semantic version redirects (cachable for 24 hours).
VERSION=$(grep -o '"version": "[^"]*"' package.json | cut -d'"' -f4)
MAJOR=$(echo $VERSION | cut -d. -f1)
MINOR=$(echo $VERSION | cut -d. -f2)
PATCH=$(echo $VERSION | cut -d. -f3)
REVISION=$(git rev-parse --short HEAD)
cd dist/otherjs/${VERSION}+${REVISION}
for FILE in *
do
  # Exact version: https://docs.npmjs.com/misc/semver#versions
  aws --region=us-west-2 s3api put-object --bucket apps.other.chat --acl public-read --key otherjs/${MAJOR}.${MINOR}.${PATCH}/${FILE} --website-redirect-location /otherjs/${VERSION}+${REVISION}/${FILE} --content-type application/javascript --cache-control "max-age=86400, public"

  # TODO: Range support is extremely limited. Fill it out.

  # X ranges: https://docs.npmjs.com/misc/semver#x-ranges-12x-1x-12-
  aws --region=us-west-2 s3api put-object --bucket apps.other.chat --acl public-read --key otherjs/${MAJOR}.${MINOR}.x/${FILE} --website-redirect-location /otherjs/${VERSION}+${REVISION}/${FILE} --content-type application/javascript --cache-control "max-age=86400, public"
  aws --region=us-west-2 s3api put-object --bucket apps.other.chat --acl public-read --key otherjs/${MAJOR}.x/${FILE} --website-redirect-location /otherjs/${VERSION}+${REVISION}/${FILE} --content-type application/javascript --cache-control "max-age=86400, public"

  # Tilde ranges: https://docs.npmjs.com/misc/semver#tilde-ranges-123-12-1
  for i in $(seq 0 $PATCH)
  do
    aws --region=us-west-2 s3api put-object --bucket apps.other.chat --acl public-read --key otherjs/~${MAJOR}.${MINOR}.${i}/${FILE} --website-redirect-location /otherjs/${VERSION}+${REVISION}/${FILE} --content-type application/javascript --cache-control "max-age=86400, public"
  done

  # Caret ranges: https://docs.npmjs.com/misc/semver#caret-ranges-123-025-004
  for i in $(seq 0 $MINOR)
  do
    aws --region=us-west-2 s3api put-object --bucket apps.other.chat --acl public-read --key otherjs/^${MAJOR}.${i}.x/${FILE} --website-redirect-location /otherjs/${VERSION}+${REVISION}/${FILE} --content-type application/javascript --cache-control "max-age=86400, public"
  done
done
