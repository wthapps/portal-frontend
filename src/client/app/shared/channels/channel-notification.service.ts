import { Injectable, EventEmitter }     from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { CableService } from './cable.service';
import { UserService, ApiConfig } from '../../shared/index';

declare let App: any;

@Injectable()
export class ChannelNotificationService extends CableService {

  hasNotification: EventEmitter<any> = new EventEmitter();
  private item: any;

  constructor(private userService: UserService) {
    super();
    // if(this.userService.loggedIn) {
      this.createConnectionInstance(this.userService);

    // this.notification = new Observable(observer => {
    //   observer.next(this.item);
    // });

    (function () {
        App.notification = App.cable.subscriptions.create(ApiConfig.actionCable.notificationChannel, {

        connected: function () {
        },
        disconnected: function () {
        },
        received: function (response: any) {
          this.item = response;
          console.log('item: ', this.item);
         // this.hasNotification.emit(response);
        },
        sendMessage: function (chatroom_id: any, message: any) {
          return this.perform('send_message', {
            chatroom_id: chatroom_id,
            body: message
          });
        }
      });

    }).call(this);
    // }
  }

  update(): Observable<any> {
    return this.hasNotification;
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

