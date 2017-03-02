import { Injectable } from '@angular/core';
import { ApiBaseService } from '../services/apibase.service';
import { Constants } from '../config/constants';
import { NotificationChannelService } from './notification-channel.service';
import { Router, ActivatedRoute } from '@angular/router';

/**
 * Created by phat on 18/11/2016.
 */

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
          this.markAsSeen();
        },
        (error: any) => {
          console.log('error', error);
        });

  }

  doAction(action: any, notif_id: string) {
    let link: string = action.link;
    let method = action.method;
    let params = action.params;
    let method_name = action.name;
    let body = { url: link,
      // method: method
    };
    Object.assign(body, params);
    this.currentNotifId = notif_id;

    switch (method) {
      case 'navigate':
        this.router.navigate(['/' + link ], { relativeTo: this.route });

        let currentNotif = _.find(this.notifications, {id: this.currentNotifId});
        this.markAsRead(currentNotif);

        break;
      case 'post':
        this.api.post(link, JSON.stringify(body))
          .subscribe((result: any) => {
              // Reload data
              _.remove(this.notifications, {id: this.currentNotifId}); // Remove current notification
              console.log('result: ', result);
            },
            (error: any) => {
              console.log('error', error);
            });
        break;

      case 'delete':
        this.api.delete(action.link)
          .subscribe((result: any) => {
            console.log('Notification service deleted');
          },
          (error: any) => {
            console.log('error', error);
          });
        break;
      default:
        console.log('error', 'DoAction: Unhandled method ' + method + ' with method name: ' + method_name);
    }
  }

  startChannel() {

    this.getNewNotificationsCount();
    this.getLatestNotifications();

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




