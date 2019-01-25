#!/usr/bin/env bash
# TODO: put PEM key to a secret variable
echo "=== Start deploy all modules to ENV: $ENV ==="
echo "=== USAGE: ENV='stag/prod' sh build_deploy_all.sh | tee build_deploy.log ===="

case $ENV in
  prod)
    ENV=production
    PEM_KEY=~/working/keys/productionwthappscom.pem
    TARGET_MACHINE=centos@34.211.124.230
    TARGET_FOLDER=/var/wthapps/web-ui
    ;;
   test)
    ENV=test
    PEM_KEY=~/working/keys/staging_wthapps_rsa.pem
    TARGET_MACHINE=root@206.189.88.173
    TARGET_FOLDER=/var/wthapps/test
    ;;
   *)
    ENV=stag
    PEM_KEY=~/working/keys/staging_wthapps_rsa.pem
    TARGET_MACHINE=root@206.189.88.173
    TARGET_FOLDER=/var/wthapps/staging

esac


BK=`date '+%Y-%m-%d_%H%M%S'`
# echo " ===== Start create Backup folder $TARGET_MACHINE:$TARGET_FOLDER/$BK ... "
# ssh -i $PEM_KEY $TARGET_MACHINE "mkdir -p $TARGET_FOLDER/${ENV}_${BK}"

proceed() {
  var=$1
  echo " ===== Start build module [$var] ... " &&
  ng build $var -c $ENV || failed $var &&  
  echo " ===== Finish build folder [$var] " &&


  echo " ===== Start backup folder [$var] $TARGET_MACHINE:$TARGET_FOLDER/$var ... " &&
  ssh -i $PEM_KEY $TARGET_MACHINE "cp -rf $TARGET_FOLDER/$var $TARGET_FOLDER/${ENV}_${var}_${BK}" &&
  echo " ===== Finish backup folder [$var] $TARGET_MACHINE:$TARGET_FOLDER/$var ... " &&


  echo " ===== Start deploying folder [$var] from /dist/$var/* to $TARGET_MACHINE:$TARGET_FOLDER/$var ... " &&
  rsync -avL --force --progress  -e "ssh -i $PEM_KEY" ./dist/$var/* $TARGET_MACHINE:$TARGET_FOLDER/$var &&
  echo " ===== Finish deploy folder [$var] "
}

failed() {
  app=$1
  echo "=== FAILED at $app"
  return 1
}

# MODULES="portal chat contact media my-account note social"
multi_proceed() {
  modules=$1
  for var in $modules
  do
    proceed $var &
  done
  wait
  echo "=== Done multi  $modules ==="
}

# Process modules in batches. Ex:
# multi_proceed "portal chat contact" && multi_proceed "my-account note social"

