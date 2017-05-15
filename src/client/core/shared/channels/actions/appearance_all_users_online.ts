import { ServiceManager } from '../../services/service-manager';

export class AppearanceAllUsersOnline {
  constructor(private data:any, private serviceManager:ServiceManager) {

  }

  process() {
    this.serviceManager.getStorageService().save('users_online', this.data);
  }
}


