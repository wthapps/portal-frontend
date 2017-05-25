import { Injectable }     from '@angular/core';
import { ApiConfig } from '../config/api.config';


declare let ActionCable: any;
declare let App: any;

@Injectable()
export class CableService {

  createConnectionInstance(userId: any, type?: string, clientId?: string) {
    if (App == undefined || App.cable == undefined) {
      // if(type == 'cs') {
      //   App.cable = ActionCable.createConsumer(`${ApiConfig.url}cable?t=${type}&cId=${clientId}`);
      //   return;
      // }

      App || (App = {}) ;
      //TODO refactor all places that call this method for creating Connection Instance
      App.cable = ActionCable.createConsumer(`${ApiConfig.url}cable?user_id=${userId}&t=${type}`);
    }
  }
}


