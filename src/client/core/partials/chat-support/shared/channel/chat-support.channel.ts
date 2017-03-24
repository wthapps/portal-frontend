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
import { Constants } from '../../../../shared/config/constants';
import { CookieOptionsArgs } from 'angular2-cookie/services/cookie-options-args.model';

declare let App: any;

@Injectable()
export class ChatSupportChannel extends CableService {

  observer: Observer<any>;
  messageData: Observable<any>;

  constructor(private userService: UserService, private cookie: CookieService, private api: ApiBaseService) {
    super();
    this.messageData = new Observable((observer: any) => {
        this.observer = observer;
      }
    );
  }

  subscribe(conversationId: any, type?: string) {
    let cId: string = this.cookie.get(Constants.cookieKeys.chatSupportId); // wthapps chat support id

    this.createConnectionInstance(cId, type);

    var self = this;

    (function () {
      App[`conversation:${conversationId}`] = App.cable.subscriptions.create(
        {
          channel: ApiConfig.actionCable.chatSupportChannel,
          conversationId: conversationId
        }, {
        connected: function(){
          console.log('cs connected');
        },
        disconnected: function(){
          console.log('cs disconnected');
        },
        received: function(data: any){
          console.log('received chat data', data);
          self.observer.next(data);
        },
        sendMessage: function (conversationId: any, message: any) {
          console.log('sending message.............', this.observer, self.observer);
          return this.perform('send_message', {
            conversationId: conversationId,
            message: message
          });
        }
      });
    }).call(this, self);
  }

}

