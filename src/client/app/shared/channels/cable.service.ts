import { Injectable }     from '@angular/core';
import { UserService, ApiConfig } from '../../shared/index';


declare let ActionCable: any;
declare let App: any;

@Injectable()
export class CableService {

  createConnectionInstance(userService: any) {
    if (App.cable == undefined ) {
      App.cable = ActionCable.createConsumer(`${ApiConfig.url}/cable?user_id=${userService.profile.id}`);
    }
  }

  createChatInstance(owner_id:number, friend_id:number) {
    App.cable = ActionCable.createConsumer(`${ApiConfig.url}/cable?user_id=${owner_id}&friend_id=${friend_id}`);
  }
}


