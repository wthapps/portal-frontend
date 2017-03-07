import { Injectable }     from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { CableService } from '../../../../shared/channels/cable.service';
import { UserService } from '../../../../shared/services/user.service';
import { ApiConfig } from '../../../../shared/config/api.config';

declare let App: any;

@Injectable()
export class ChatSupportChannelService extends CableService {

  observer: Observer<any>;
  notificationUpdated: Observable<any>;

  private item: any;
  constructor(private userService: UserService) {
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
    this.createConnectionInstance(null, 'support', '123456789');
    let _this = this;
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

