## Copy and paste into server
- rsync -avL --progress  -e "ssh -i ~/deployment/productionwthappscom.pem" ./dist/note/* centos@34.211.124.230:/var/wthapps/web-ui/note
