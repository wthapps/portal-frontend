import { Injectable }     from '@angular/core';
import { CableService } from './cable.service';
import { UserService, ApiConfig } from '../../shared/index';

declare let App: any;

@Injectable()
export class ChannelNotificationService extends CableService {

  constructor(private userService: UserService) {

    this.createConnectionInstance(this.userService);
    console.log('constructor notification');
    (function () {
        App.notification = App.cable.subscriptions.create(ApiConfig.actionCable.notificationChannel, {

        connected: function () {
        },
        disconnected: function () {
        },
        received: function (response: any) {
          console.log('response', response);
        },
        sendMessage: function (chatroom_id: any, message: any) {
          return this.perform('send_message', {
            chatroom_id: chatroom_id,
            body: message
          });
        }
      });

    }).call(this);
  }

  testing() {



    // App.notifications = App.cable.subscriptions.create('NotificationsChannel', {
    //
    //   connected: function() {},
    //   disconnected: function() {},
    //   received: function(response: any) {
    //     console.log('response', response);
    //   },
    //   sendMessage: function(chatroom_id: any, message: any) {
    //     return this.perform('send_message', {
    //       chatroom_id: chatroom_id,
    //       body: message
    //     });
    //   }
    // });
  }
}

