#!/bin/sh
./deploy-app-prev.sh && npm run build.prod -- --app app && cp -R src/client/assets/ dist/prod/assets/ && rm -rf src/client/app/core && git reset --hard && cp -R dist/prod/ ../deploy/app/;
