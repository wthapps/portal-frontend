/**
 * Created by Thinh Huynh Doan February 25th, 2017
 */

import { Injectable }     from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { CableService } from '../../../../shared/channels/cable.service';
import { UserService } from '../../../../shared/services/user.service';
import { ApiConfig } from '../../../../shared/config/api.config';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { ApiBaseService } from '../../../../shared/services/apibase.service';


declare let App: any;

@Injectable()
export class ChatSupportUserStatusChannel extends CableService {

  observer: Observer<any>;
  notificationUpdated: Observable<any>;

  constructor(private userService: UserService) {
    super();
  }

  subscribe() {

    this.createConnectionInstance(null, 'cs', this.userService.profile.uuid);
    let self = this;
    App.chatSupport = App.cable.subscriptions.create(ApiConfig.actionCable.chatSupportUserStatusChannel, {
      connected: function(){
        console.log('cs user status connected');
      },
      disconnected: function(){
        console.log('cs user status disconnected');
      },
      received: function(data:any){
        console.log('cs user status received', data);
      }
    });
  }

}

