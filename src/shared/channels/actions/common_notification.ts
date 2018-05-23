import { Processable } from './processable';
import { ServiceManager } from '../../services';
import { Constants } from '@wth/shared/constant';

declare let _:any;

export class CommonNotification implements Processable {
  constructor(public serviceManager: ServiceManager) {

  }

  process(data: any) {
    let notification_type = JSON.parse(data.data).notification_type;
    if(notification_type == Constants.notificationType.connection)
      this.serviceManager.getConnetionNotificationService().addNewNofification(data);
    else
      this.serviceManager.getCommonNotificationService().addNewNofification(data);
  }

}


