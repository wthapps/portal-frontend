import { ServiceManager } from '../../services/service-manager';

declare let _:any;

export class AppearanceNewUserOnline {
  constructor(private data:any, private serviceManager:ServiceManager) {

  }

  process() {
    let users = this.serviceManager.getStorageService().find('users_online').value;
    users.push(this.data.id);
    this.serviceManager.getStorageService().save('users_online', _.union(users));
  }
}


