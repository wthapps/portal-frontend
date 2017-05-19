/**
 * Created by Thinh Huynh Doan February 25th, 2017
 */

import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiBaseService } from '../../shared/services/apibase.service';
import { Constants } from '../../shared/config/constants';
import { NotificationChannelService } from '../../shared/channels/notification-channel.service';

declare var _: any;

@Injectable()
export class ChatSupportService {
  notifications: Array<any> = new Array<any>();
  newNotifCount: number = 0 ;
  notifOffset: number = 0;
  currentNotifId: any;

  turnOffNotification(notification: any) {
    // TODO
  }

  constructor(private api: ApiBaseService,
              private router: Router,
              private route: ActivatedRoute,
              private notificationChannel: NotificationChannelService) {
  }

  get() {
    return this.api.get(`${Constants.urls.zoneSoNotifications}`);
  }

  viewAllNotifications() {
    this.api.get(`${Constants.urls.zoneSoNotifications}`)
      .subscribe(
        (result: any) => {
          _.remove(this.notifications);
          this.notifications = result.data;
          this.newNotifCount = 0;
        },
        (error: any) => {
          console.log('error', error);
        });

  }

  doAction(action: any, notif_id: string) {

  }

  startChannel() {



    this.notificationChannel.createSubscription();

    if( this.notificationChannel.notificationUpdated) {
      this.notificationChannel.notificationUpdated
        .subscribe(
          (notification: any) => {
            this.notifications.unshift(JSON.parse(notification));
            this.newNotifCount++;
          });
    }
  }
}




