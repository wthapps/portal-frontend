import { Processable } from './processable';
import { ServiceManager } from '../../services/service-manager';

declare let _:any;

export class CommonNotification implements Processable {
  constructor(public serviceManager: ServiceManager) {

  }

  process(data: any) {
    this.serviceManager.getCommonNotificationService().addNewNofification(data);
  }

}


