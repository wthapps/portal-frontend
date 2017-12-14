import { Processable } from './processable';
import { ServiceManager } from '../../../../shared/services';

declare let _:any;

export class AppearanceNewUserOnline implements Processable {
  constructor(private serviceManager: ServiceManager) {
    if (!this.serviceManager.getStorageService().find('users_online')) {
      this.serviceManager.getStorageService().save('users_online', null);
    }
  }

  process(data: any) {
    let users = this.serviceManager.getStorageService().find('users_online').value;
    if (users) {
      users.push(data.data.id);
      this.serviceManager.getStorageService().save('users_online', _.union(users));
    }
  }
}


