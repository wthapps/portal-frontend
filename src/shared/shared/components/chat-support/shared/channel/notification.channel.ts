/**
 * Created by Thinh Huynh Doan February 25th, 2017
 */

import { Injectable }     from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { CookieService } from 'ngx-cookie';

import { CableService } from '../../../../channels/cable.service';
import { UserService } from '../../../../services/user.service';
import { ApiBaseService } from '../../../../services/apibase.service';
import { Constants } from '../../../../../constant/config/constants';
import { ApiConfig } from '../../../../../constant/config/api.config';

declare let App: any;

@Injectable()
export class NotificationChannel extends CableService {

  observer: Observer<any>;
  hasDataChanged: Observable<any>;

  constructor(private userService: UserService, private cookie: CookieService, private api: ApiBaseService) {
    super();
    this.hasDataChanged = new Observable((observer: any) => {
        this.observer = observer;
      }
    );
  }

  subscribe(type?: string) {
    let cId: string = this.cookie.get(Constants.cookieKeys.chatSupportId); // wthapps chat support id

    this.createConnectionInstance(cId, type);

    var self = this;

    (function () {
      App.csNotification = App.cable.subscriptions.create(ApiConfig.actionCable.chatNotificationChannel, {
        connected: function () {
          console.log('cs connected');
        },
        disconnected: function () {
          console.log('cs disconnected');
        },
        received: function (data: any) {
          self.observer.next(data);
        },
        sendMessage: function (conversationId: any, message: any) {
          // console.log('cs notification message.............');
          // return this.perform('send_message', {
          //   conversationId: conversationId,
          //   message: message
          // });
        }
      });
    }).call(this, self);
  }

}

