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
export class ChatSupportChannelService extends CableService {

  observer: Observer<any>;
  notificationUpdated: Observable<any>;

  private item: any;
  constructor(private userService: UserService, private cookie: CookieService, private api: ApiBaseService) {
    super();
  }


  createSubscription() {
    this.notificationUpdated = new Observable(
      (observer: any) => {
        this.observer = observer;
      }
    );

    var self = this;
    (function () {

      App.chatSupport = App.cable.subscriptions.create(ApiConfig.actionCable.chatSupportChannel, {
        connected: function () {
          console.log('connected');
        },
        disconnected: function () {
          console.log('disconnected');
        },
        received: function (response: any) {
          this.item = response;
          self.observer.next(response);
        },
        sendMessage: function (chatroom_id: any, message: any) {
          return this.perform('send_message', {
            chatroom_id: chatroom_id,
            body: message
          });
        }
      });
    }).call(this, self);
  }


  subscribe() {
    //get unique client id

    let cId: string = this.cookie.get(Constants.cookieKeys.chatSupportId); // wthapps chat support id
    console.log('cookie', cId);
    if (cId == undefined) {
      this.api.post(`chat_support/init`, {user: null})
          .subscribe(
            (response: any) => {
              let cId = response.data.user.anonymous_uuid;
              this.cookie.put(Constants.cookieKeys.chatSupportId, cId , <CookieOptionsArgs>Constants.cookieOptionsArgs);
            }
          );
      return;
    }



    this.createConnectionInstance(null, 'cs', '123456789');
    let self = this;
    App.chatSupport = App.cable.subscriptions.create(ApiConfig.actionCable.chatSupportChannel, {
      connected: function(){
        console.log('connected');
      },
      disconnected: function(){
        console.log('disconnected');
      },
      received: function(data:any){
        console.log('received', data);

      }
    });
  }

}

