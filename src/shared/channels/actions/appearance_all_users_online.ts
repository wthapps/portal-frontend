import { Processable } from './processable';
import { ServiceManager } from '../../services';

export class AppearanceAllUsersOnline implements Processable {
  constructor(private serviceManager: ServiceManager) {

  }

  process(data: any) {
    this.serviceManager.getStorageService().save('users_online', data.data);
  }
}


