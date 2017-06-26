#rsync -avL --progress  -e "ssh -i /home/hdthinh/Downloads/staging-wthappscom.pem" /home/hdthinh/wthapps/portal-frontend/dist/prod/* ubuntu@54.213.41.54:/home/wthapps/web-ui/social/



rsync -avL --progress  -e "ssh -i /home/hdthinh/Downloads/staging-wthappscom.pem" ./dist/prod/* ubuntu@54.213.41.54:/home/wthapps/web-ui/social/
