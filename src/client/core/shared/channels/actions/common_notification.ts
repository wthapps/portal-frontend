import { Processable } from './processable';
import { ServiceManager } from '../../services/service-manager';

declare let _:any;

export class CommonNotification implements Processable {
  constructor(private data: any, public serviceManager: ServiceManager) {

  }

  process() {
    this.serviceManager.getCommonNotificationService().addNewNofification(this.data);
  }

}


