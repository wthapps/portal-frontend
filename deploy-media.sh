#!/bin/sh
./deploy-media-prev.sh && npm run build.prod -- --app media && cp -R src/client/assets/ dist/prod/assets/ && rm -rf src/client/media/core && git reset --hard && cp -R dist/prod/ ../deploy/media/;
