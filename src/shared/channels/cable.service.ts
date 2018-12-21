import { Injectable } from '@angular/core';
import { ApiConfig } from '../constant/config/api.config';

import * as ActionCable from 'actioncable';
declare let App: any;

@Injectable()
export class CableService {
  createConnectionInstance(userId: any, type?: string, clientId?: string) {
    if (!App || !App.cable) {
      console.log('create connection instance ...');
      // TODO refactor all places that call this method for creating Connection Instance
      App.cable = ActionCable.createConsumer(
        `${ApiConfig.url}cable?user_id=${userId}&t=${type}`
      );
    }
  }
}
