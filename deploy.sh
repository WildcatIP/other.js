#!/bin/bash
set -ex

aws --region=us-west-2 s3 sync --acl public-read --exclude ".*" ./dist/ s3://apps.other.chat/
