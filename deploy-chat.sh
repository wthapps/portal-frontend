#!/bin/sh
./deploy-chat-prev.sh && npm run build.prod -- --app chat && cp -R src/client/assets/ dist/prod/assets/ && rm -rf src/client/chat/core && git reset --hard && cp -R dist/prod/ ../deploy/chat/;
