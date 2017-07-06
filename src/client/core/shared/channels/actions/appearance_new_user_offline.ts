import { ServiceManager } from '../../services/service-manager';

declare let _:any;

export class AppearanceNewUserOffline {
  constructor(private data:any, private serviceManager:ServiceManager) {
    if (!this.serviceManager.getStorageService().find('users_online')) {
      this.serviceManager.getStorageService().save('users_online', null);
    }
  }

  process() {
    let users = this.serviceManager.getStorageService().find('users_online').value;
    _.pull(users, this.data.id);
    this.serviceManager.getStorageService().save('users_online', _.union(users));
  }
}


