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
import { Constants } from '../../../../shared/config/constants';


declare let App: any;

@Injectable()
export class AppearanceChannel extends CableService {

  observer: Observer<any>;
  appearanceDataChanged: Observable<any>;

  constructor(private userService: UserService, private cookie: CookieService) {
    super();
    this.appearanceDataChanged = new Observable(
      (observer: any) => {
        this.observer = observer;
      }
    );
  }

  subscribe(type?: string) {

    if (this.userService.loggedIn && type === 'cs') {
      this.createConnectionInstance(this.cookie.get(Constants.cookieKeys.chatSupportId), 'cs');
    } else {
      this.createConnectionInstance(this.userService.profile.uuid);
    }


    var self = this;
    (function () {

      App.appearance = App.cable.subscriptions.create(ApiConfig.actionCable.appearanceChannel, {
      connected: function(){
        this.goOnline();

      },
      disconnected: function(){
        // process offlline in server
      },
      received: function(data: any){
        self.observer.next(data);
      },
      goOnline: function(){
        // broadcast online status for other user
      },
      goOffline: function(){
        //disable this function
      }

    });
    }).call(this, self);
  }

}

