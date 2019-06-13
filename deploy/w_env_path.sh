#!/bin/sh

### This file is used for deploying to multiple environments
### If there are any update on this please do below steps
### 1. copy this file to /etc/profile.d directory
### 2. update changes
#### run source ./w_env_path.sh

##
# Replace value of below vairables
# 1. W_KEYS_DIR_PATH=path-to-folder-contains-keys
# 2. W_KEY_PROD_NAME=production-key-name (.pem file)
# 3. W_KEY_STAG_NAME=staging-key-name (.pem file)
# 4. W_KEY_TEST_NAME=test-key-name (.pem file)
# 5. W_WEB_DIR_PATH=path-to-portal-frontend-folder

# ACCESS KEYS DIRECTORY PATH
export W_KEYS_DIR_PATH=/Users/thinhhd/working/wthapps/access-keys
export W_KEY_PROD_NAME=productionwthappscom.pem
export W_KEY_STAG_NAME=staging_wthapps_rsa.pem
export W_KEY_TEST_NAME=staging_wthapps_rsa.pem

# PROJECT WORKING DIRECTORY PATH
export W_WEB_DIR_PATH=/Users/thinhhd/working/wthapps/portal-frontend
export W_API_DIR_PATH=/Users/thinhhd/working/wthapps/admin-api
