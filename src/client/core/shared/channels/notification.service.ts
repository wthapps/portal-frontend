import { Injectable } from '@angular/core';
import { ApiBaseService } from '../services/apibase.service';
import { Constants } from '../config/constants';
import { ChannelNotificationService } from './channel-notification.service';

/**
 * Created by phat on 18/11/2016.
 */

declare var _: any;

@Injectable()
export class NotificationService {
  notifications: Array<any> = new Array<any>();
  newNotifCount: number = 0 ;
  notifOffset: number = 0;
  currentNotifId: any;

  turnOffNotification(notification: any) {
    // TODO
  }

  constructor(private api: ApiBaseService,
              private notificationChannel: ChannelNotificationService) {
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
    let link = action.link;
    let method = action.method;
    let params = action.params;
    let method_name = action.name;
    let body = { url: link,
      // method: method
    };
    Object.assign(body, params);
    this.currentNotifId = notif_id;

    // switch (method_name) {
    //   case "accept":
    //     acceptInvitation(body); break;
    //   case "cancel":
    //     cancelInvitation(body); break;
    //   default:
    //     console.log('error', 'Unhandle method ' + method_name);
    // }

    switch (method) {
      case "post":
        this.api.post(link, JSON.stringify(body))
          .subscribe((result: any) => {
              // Reload data
              _.remove(this.notifications, {id: this.currentNotifId}); // Remove current notification
              // $('#notification_'+this.currentNotifId).remove();
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
        console.log('error', 'DoAction: Unhandle method ' + method + ' with method name: ' + method_name);
    }
  }


  markAsSeen(){

    console.log('markAsSeen', this.notifications.length);
    // this.notificationService.markAsSeen(this.notifications)
    let notif_ids = _.map(this.notifications, (i: any) => i.id);
    let body = {"ids" : notif_ids};

    // TODO: Convert this method to put
    return this.api.post(`${Constants.urls.zoneSoNotifications}/mark_as_seen`, body)
      .subscribe(
        (result: any) => {
          this.countNewNotifications();
          _.each(this.notifications, (i: any) => i.seen_state = Constants.seenStatus.seen);

          // this.newNotifCount -= this.notifications.length;
          // this.notifications = result.data;

        },
        (error: any) => {
          console.log('error', error);
        });
  }

  toggleReadStatus(notification: any){
    this.currentNotifId = notification.id;
    let body = {"ids" : this.currentNotifId};
    return this.api.post(`${Constants.urls.zoneSoNotifications}/toggle_read_status`, body)
      .subscribe(
        (result: any) => {
          _.each(this.notifications, (n: any) => { if(n.id == this.currentNotifId) n.is_read = !n.is_read;});

        },
        (error: any) => {
          console.log('error', error);
        });
  }

  toggleAllReadStatus(){
    this.api.post(`${Constants.urls.zoneSoNotifications}/toggle_all_read_status`, [])
      .subscribe(
        (result: any) => {
          let overallReadStatus = result.data;
          _.each(this.notifications, (n: any) => {n.is_read = overallReadStatus});

        },
        (error: any) => {
          console.log('error', error);
        });
  }

  getLatestNotifications() {
    let notif_limit = Constants.notificationSetting.limit;
    this.api.get(`${Constants.urls.zoneSoNotifications}/get_latest/${this.notifOffset}/${notif_limit}`)
      .subscribe(
        (result: any) => {
          _.remove(this.notifications); // Make sure this.notifications has no value before assigning
          this.notifications = result.data;
          // this.countNewNotifications();

        },
        (error: any) => {
          console.log('error', error);
        });
  }

  getNewNotificationsCount() {
    this.api.get(`${Constants.urls.zoneSoNotifications}/get_new_notifications/count`)
      .subscribe(
        (result: any) => {
          this.newNotifCount = result.data;

        },
        (error: any) => {
          console.log('error', error);
        });
  }

  hideNotification(notification: any) {
    this.currentNotifId = notification.id;
    this.api.delete(`${Constants.urls.zoneSoNotifications}/${this.currentNotifId}`)
      .subscribe((result: any) => {
          _.remove(this.notifications, {id: this.currentNotifId}); // Remove current notification
          console.log('result: ', result);
        },
        (error: any) => {
          console.log('error', error);
        });
  }

  countNewNotifications() {
    // this.newNotifCount = 0;
    // this.newNotifCount = _.filter(this.notifications, (n) => n.seen_state == Constants.seenStatus.new).length;
    let temp_notif_count = _.filter(this.notifications, (n: any) => n.seen_state == Constants.seenStatus.new).length;
    if (temp_notif_count > 0)
      this.newNotifCount -= temp_notif_count;
    this.newNotifCount = (this.newNotifCount < 0 ? 0 : this.newNotifCount);
  }

  startChannel() {

    this.getNewNotificationsCount();
    this.getLatestNotifications();

    this.notificationChannel.createSubscription();

    if( this.notificationChannel.notificationUpdated){
      this.notificationChannel.notificationUpdated
        .subscribe(
          (notification: any) => {
            this.notifications.unshift(JSON.parse(notification));
            this.newNotifCount++;
          });
    }
  }
}




