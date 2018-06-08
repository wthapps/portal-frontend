# TODO: put PEM key to a secret variable
echo "=== Start deploy all modules to ENV: $ENV ==="
echo "=== Should update PEM_KEY location before using ===="
echo "=== USAGE: ENV='stag/prod' sh deploy_all.sh ===="

case $ENV in
  prod)
    ENV=prod
    PEM_KEY=~/working/keys/productionwthappscom.pem
    TARGET_MACHINE=centos@34.211.124.230
    TARGET_FOLDER=/var/wthapps/web-ui
    ;;
   *)
    ENV=stag
    PEM_KEY=~/working/keys/staging_wthapps_rsa.pem
    TARGET_MACHINE=root@206.189.88.173
    TARGET_FOLDER=/var/wthapps/staging

esac

# MODULES="portal chat contact media my-account note social"
MODULES="portal social"
for var in $MODULES
do
   echo " ===== Start deploying folder [$var] from /dist/$var/* to $TARGET_MACHINE:$TARGET_FOLDER/$var ... "
   rsync -avL --force --progress  -e "ssh -i $PEM_KEY" ./dist/$var/* $TARGET_MACHINE:$TARGET_FOLDER/$var
   echo " ===== Finish deploy folder [$var] "
done
