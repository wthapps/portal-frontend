#!/bin/bash

# Make sure ENV VARIABLES are available first by to to current folder running below commands
# source ./w_env_path.sh 
# source ./web_deploy.sh 

# echo "=== Start deploy all modules to ENV: $ENV ==="
# echo "=== USAGE: ENV='prod|stag|test|dev' sh build_deploy_all.sh | tee build_deploy.log ===="
# echo "=== USAGE: ENV='prod|stag|test|dev' sh build_deploy_all.sh | tee build_deploy.log ===="
# FAILED_LOG=build_deploy_failed.log
# w_release_web prod "portal my-account contact media chat"
# Validate input arguments
__validate_arguments() {
    if [ -z "$1" ]
    then
        echo "Please input environemnt value"
        return 1
    fi
    if [ -z "$2" ]
    then
        echo "Please input module to build"
        return 1
    fi
}

__get_env() {
    return "$0"
}

__get_apps() {
    return "$1"
}

__w_build_module() {
    echo "=== Building $2..." &&
    ng build -c $1 $2 &&
    echo "=== Finished building $2!"
}

__w_backup_module() {
    echo "=== Backuping $2..."    
}

__w_deploy_module() {
    echo "=== Deploying $2..."    
}

## This command support deploying spcific module
# $1: enviroment name
# value of $1: production|stag|test
#
# $2: module name
# value of $2: protal|my-account|media|chat|contact|note|social|drive
# 
# Example:
# w_release_module test "portal"   
##
w_release_module() {
    __validate_arguments $1 $2
    printf "\n=== Releasing $2...\n" &&   
    environment=$1
    module=$2
    current_path=$(pwd)
    cd $W_WEB_DIR_PATH &&

    __w_build_module $1 $2
    # __w_backup_module $1 $2
    # __w_deploy_module $1 $2
    case $environment in
    prod|production)
        PEM_KEY=$W_KEYS_DIR_PATH/$W_KEY_PROD_NAME
        TARGET_MACHINE=centos@34.211.124.230
        TARGET_PATH=/var/wthapps/web-ui
        ;;
    stag)
        PEM_KEY=$W_KEYS_DIR_PATH/$W_KEY_STAG_NAME
        TARGET_MACHINE=root@206.189.88.173
        TARGET_PATH=/var/wthapps/staging
        ;;
    test)
        PEM_KEY=$W_KEYS_DIR_PATH/$W_KEY_TEST_NAME
        TARGET_MACHINE=root@206.189.88.173
        TARGET_PATH=/var/wthapps/test    
    esac

    case $module in
        contact) RELEASE_MODULE=contacts ;;
        note) RELEASE_MODULE=notes ;;
        media) RELEASE_MODULE=photos ;;
        my-account) RELEASE_MODULE=myaccount ;;
        *) RELEASE_MODULE=$module    
    esac


    BK=`date '+%Y-%m-%d-%H%M%S'`
    BK_DIR=backup
    echo "=== Start backup [$module] $TARGET_MACHINE:$TARGET_PATH/$RELEASE_MODULE ..." &&
    ssh -i $PEM_KEY $TARGET_MACHINE "cp -rf $TARGET_PATH/$RELEASE_MODULE $TARGET_PATH/$BK_DIR/${RELEASE_MODULE}_${BK}" &&
    echo "=== Finish backup [$module] $TARGET_MACHINE:$TARGET_PATH/$BK_DIR/${RELEASE_MODULE}_${BK} ..." &&
    
    echo "=== Start deploy [$module] from /dist/$module/* to $TARGET_MACHINE:$TARGET_PATH/$RELEASE_MODULE ... " &&
    rsync -avL --force --progress  -e "ssh -i $PEM_KEY" ./dist/$module/* $TARGET_MACHINE:$TARGET_PATH/$RELEASE_MODULE &&
    
    echo "=== Finish deploy [$module]" &&
    printf "=== Releasing $2...\n" &&
    cd $current_path
}

## This command support deploying multiple modules
# $1: enviroment name
# value of $1: prod|stag|test
#
# $2: Array of modules
# value of $2: "portal my-account media chat contact note social|drive"
# module name must be in "protal|my-account|media|chat|contact|note|social|drive
## 
# HOW TO START WITH COMMANDS
# 1. Go to folder contains w_env_path.sh & web_deploy.sh
# 2. Update VARIABLES' path and name in w_env_path.sh file
# 3. Run below commands
#       source ./w_env_path.sh 
#       source ./web_deploy.sh 
#       w_release_web test "portal my-account media chat contact note social drive" - deploy multiple modules
##
# DEPLOYMENT FOLDER STRUCTURE
# wthapps -> test
#            |______ portal        
#            |______ myaccount        
#            |______ chat        
#            |______ contacts        
#            |______ photos        
#            |______ notes        
#            |______ social
#            |______ drive
#            |______ .....
#            |______ .....
#            |______ backup        
## 
# Example:
# - deploy multiple modules
# w_release_web test "portal my-account media chat contact note social drive"
# w_release_web test "portal my-account media chat contact"   
# deploy one module 
# w_release_web test "portal"   
##

w_release_web() {
    
    __validate_arguments $1 $2

    # Get arguments' value
    case $1 in
        prod|production) env=production ;;
        stag|staging) env=stag ;;
        test) env=test ;;
        *)
            echo "Invalid environment input value" &&
            echo "Environment value: prod|stag|test" &&
            return 1
        ;;
    esac

    case $2 in
        all) modules="portal my-account contact chat media note social" ;;
        *)
            modules=$2
        ;;
    esac

    # Performce Release
    echo "=== Starting release web..." &&
    echo "=== Environment: $env" &&
    
    # Get currrent path
    current_path=$(pwd)
    # Goto web working directory 
    cd $W_WEB_DIR_PATH &&

    for module in $modules 
    do
        w_release_module $env $module
    done

    # Finish
    echo "=== Finished release: $modules" &&
    cd $current_path
}



