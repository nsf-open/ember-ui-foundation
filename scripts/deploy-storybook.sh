#!/usr/bin/env bash

# ----------------------------------------
# Ensure we're in the project root by
# first moving to this directory and then
# one out.
# ----------------------------------------
cd $(dirname $0)
cd ..

source ./.env
npm run storybook:build

aws s3 rm "$STORYBOOK_S3/storybook/ui-foundation" --recursive --profile "$S3_PROFILE"
aws s3 cp ./storybook-static "$STORYBOOK_S3/storybook/ui-foundation" --recursive --profile "$S3_PROFILE"

rm -rf ./storybook-static
