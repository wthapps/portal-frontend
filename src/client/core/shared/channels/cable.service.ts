import { Injectable }     from '@angular/core';
import { ApiConfig } from '../config/api.config';


declare let ActionCable: any;
declare let App: any;

@Injectable()
export class CableService {

  createConnectionInstance(userService: any, type?: string, clientId?: string) {
    if (App.cable == undefined) {
      if(type == 'cs') {
        App.cable = ActionCable.createConsumer(`${ApiConfig.url}cable?t=${type}&cId=${clientId}`);
        return;
      }
      App.cable = ActionCable.createConsumer(`${ApiConfig.url}cable?user_id=${userService.profile.id}`);
    }
  }
}


