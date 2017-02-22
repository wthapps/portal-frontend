#!/bin/sh

cp -R src/client/core/ src/client/media/core/;
rm -rf src/client/my-account;
rm -rf src/client/base;
rm -rf src/client/chat;
rm -rf src/client/social;
rm -rf src/client/app;
rm -rf src/client/core;
find . -type f -name '*.ts' -exec sed -i '' s/"'..\/core"/"'.\/core"/ {} +
find . -type f -name '*.ts' -exec sed -i '' s/"'..\/..\/core"/"'..\/core"/ {} +
find . -type f -name '*.ts' -exec sed -i '' s/"'..\/..\/..\/core"/"'..\/..\/core"/ {} +
find . -type f -name '*.ts' -exec sed -i '' s/"'..\/..\/..\/..\/core"/"'..\/..\/..\/core"/ {} +
find . -type f -name '*.ts' -exec sed -i '' s/"'..\/..\/..\/..\/..\/tools"/"'..\/..\/..\/..\/..\/..\/tools"/ {} +
