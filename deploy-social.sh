#!/bin/sh
./deploy-social-prev.sh && npm run build.prod -- --app social && cp -R src/client/assets/ dist/prod/assets/ && rm -rf src/client/social/core && git reset --hard && cp -R dist/prod/ ../deploy/social/;
