import { ServiceManager } from '../../services/service-manager';
import { Processable } from './processable';

export class AppearanceAllUsersOnline implements Processable {
  constructor(private serviceManager:ServiceManager) {

  }

  process(data: any) {
    this.serviceManager.getStorageService().save('users_online', data.data);
  }
}


