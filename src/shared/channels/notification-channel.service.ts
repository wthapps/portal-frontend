import { Injectable }     from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { CableService } from './cable.service';
import { UserService } from '../services/user.service';
import { ApiConfig } from '../constant/config/api.config';

declare let App: any;

@Injectable()
export class NotificationChannelService extends CableService {

  // notificationUpdated: EventEmitter = new EventEmitter();
  observer: Observer<any>;
  notificationUpdated: Observable<any>;

  private item: any;

  constructor(private userService: UserService) {
    super();
    if (this.userService.loggedIn && this.userService.getSyncProfile()) {
      this.createConnectionInstance(this.userService.getSyncProfile().uuid);

      // this.createSubscription();
    }
  }


  createSubscription() {
    this.notificationUpdated = new Observable(
      (observer: any) => {
        this.observer = observer;
      }
    );

    var self = this;
    (function () {

      App.notification = App.cable.subscriptions.create(ApiConfig.actionCable.notificationChannel, {

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
}

