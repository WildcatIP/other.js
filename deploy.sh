#!/bin/bash
set -ex

aws --region=us-west-2 s3 sync --acl public-read --exclude ".*" ./dist/ s3://apps.other.chat/
aws --region=us-west-2 s3api put-object --bucket apps.other.chat --acl public-read --key otherjs/0.0.x/other.min.js --website-redirect-location /apps.other.chat/otherjs/0.0.1%2B3880ffe/other.min.js --content-type application/javascript
