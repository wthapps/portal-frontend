** Deploy to production commend

rsync -avL --force --progress  -e "ssh -i /home/hdthinh/Downloads/productionwthappscom.pem" ./dist/media/* centos@34.211.124.230:/var/wthapps/web-ui/media
