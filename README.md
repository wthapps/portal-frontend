## Dependencies
     1. [Angular cli 1.6.1](https://github.com/angular/angular-cli#usage/)
     2. Angular 5.1.1
     3. rxjs >= 5.5.2
     3. yarn >= 1.3.2 or npm >= 5.5.1

## Start development mode

ng serve [module_name]
or 
start-[module_name]

## Build 
ng build --app [app_name] --prod --build-optimizer --aot

## Deploy to production 

rsync -avL --force --progress  -e "ssh -i /home/hdthinh/Downloads/productionwthappscom.pem" ./dist/[source_folder_name]/* centos@34.211.124.230:/var/wthapps/web-ui/[deployment_folder_name]

[source_folder_name]     must be: portal, my-account, media, social, chat, contact, note
[deployment_folder_name] must be: portal, myaccount, media, social, chat, contacts, notes