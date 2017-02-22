import { Injectable }     from '@angular/core';
import { ApiConfig } from '../config/api.config';


declare let ActionCable: any;
declare let App: any;

@Injectable()
export class CableService {

  createConnectionInstance(userService: any) {
    if (App.cable == undefined) {
      App.cable = ActionCable.createConsumer(`${ApiConfig.url}cable?user_id=${userService.profile.id}`);
    }
  }
}


