import { Processable } from './processable';
import { ServiceManager } from '../../../../shared/services';

export class AppearanceAllUsersOnline implements Processable {
  constructor(private serviceManager: ServiceManager) {

  }

  process(data: any) {
    this.serviceManager.getStorageService().save('users_online', data.data);
  }
}


