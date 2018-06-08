echo "=== USAGE: ENV='stag/prod' sh deploy_all.sh ===="

case $ENV in
  prod)
    ENV=prod
    ;;
   *)
    ENV=stag

esac

# MODULES="portal chat contact media my-account note social"
MODULES="chat social"
echo "=== Start build all modules: $MODULES to ENV: $ENV ==="
for var in $MODULES
do
   echo " ===== Start build module [$var] ... "
   ng build --prod --app $var --e $ENV &
   echo " ===== Finish build folder [$var] "
done
