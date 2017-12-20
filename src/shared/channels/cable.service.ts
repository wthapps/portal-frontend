import { Injectable }     from '@angular/core';
import { ApiConfig } from '../constant/config/api.config';

import * as ActionCable from 'actioncable';
declare let App: any;

@Injectable()
export class CableService {


  createConnectionInstance(userId: any, type?: string, clientId?: string) {
    if (App == undefined || App.cable == undefined) {
      // if(type == 'cs') {
      //   App.cable = ActionCable.createConsumer(`${ApiConfig.url}cable?t=${type}&cId=${clientId}`);
      //   return;
      // }

      //TODO refactor all places that call this method for creating Connection Instance
      App.cable = ActionCable.createConsumer(`${ApiConfig.url}cable?user_id=${userId}&t=${type}`);
    }
  }
}


