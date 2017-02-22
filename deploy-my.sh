#!/bin/sh
./deploy-my-prev.sh && npm run build.prod -- --app my-account && cp -R src/client/assets/ dist/prod/assets/ && rm -rf src/client/my-account/core && git reset --hard && cp -R dist/prod/ ../deploy/my/;
