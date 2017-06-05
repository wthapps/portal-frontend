import { Injectable } from '@angular/core';
import { ApiBaseService } from '../services/apibase.service';
import { Constants } from '../config/constants';
import { NotificationChannelService } from '../channels/notification-channel.service';
import { UserService } from './user.service';
import { Observable } from 'rxjs';
import { WTHNavigateService } from './wth-navigate.service';

/**
 * Created by phat on 18/11/2016.
 */

declare var _: any;

@Injectable()
export class NotificationService {
  notifications: Array<any> = new Array<any>();
  trashNotifications: Array<any> = new Array<any>();
  latestNotifId: number = 0;
  newNotifCount: number = 0 ;
  currentNotifId: any;
  readonly notifLimit: number = Constants.notificationSetting.limit;
  nextLink: string;
  hasObjects: boolean;

  turnOffNotification(notification: any) {
    // TODO
  }

  constructor(private api: ApiBaseService,
              private navigateService: WTHNavigateService,
              private userService: UserService,
              private notificationChannel: NotificationChannelService) {
  }

  get() {
    return this.api.get(`${Constants.urls.zoneSoNotifications}`)
      .filter(() => this.userService.loggedIn) // Do not call this API if user is not logged in
    ;
  }

  // TODO: Navigate to page of another module. Ex: From social to to media module
  doAction(action: any, notif_id: string) {
    let link: string = action.link;
    let method = action.method;
    let params = action.params;
    let method_name = action.name;
    let module = action.module; // media, social, chat ...
    let body = { url: link,
      // method: method
    };
    Object.assign(body, params);
    this.currentNotifId = notif_id;

    switch (method) {
      case 'navigate':
        // this.router.navigate(['/' + link ], { queryParams: body });
        this.navigateService.navigateOrRedirect(link, module, body);

        let currentNotif = _.find(this.notifications, {id: this.currentNotifId});
        this.markAsRead(currentNotif);

        break;
      case 'post':
        this.api.post(link, body)
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


  markAsSeen() {

    console.log('markAsSeen', this.notifications.length);
    // this.notificationService.markAsSeen(this.notifications)
    let notif_ids = _.map(this.notifications, (i: any) => i.id);
    let body = {'ids' : notif_ids};

    return this.api.post(`${Constants.urls.zoneSoNotifications}/mark_as_seen`, body)
      .filter(() => this.userService.loggedIn) // Do not call this API if user is not logged in
      .subscribe(
        (result: any) => {
          this.countNewNotifications();
          _.each(this.notifications, (i: any) => i.seen_state = Constants.seenStatus.seen);


        },
        (error: any) => {
          console.log('error', error);
        });
  }

  addNewNofification(notification: any) {
    // Detect if this notification is new or an Undo notification
    console.log('addnewNotification: ', notification);
    if (parseInt(_.get(JSON.parse(notification), 'id')) > this.latestNotifId) {
      this.notifications.unshift(JSON.parse(notification));
      this.newNotifCount++;
    }
  }



  toggleReadStatus(notification: any) {
    this.currentNotifId = notification.id;
    let body = {'ids' : this.currentNotifId};
    return this.api.post(`${Constants.urls.zoneSoNotifications}/toggle_read_status`, body)
      .filter(() => this.userService.loggedIn) // Do not call this API if user is not logged in
      .subscribe(
        (result: any) => {
          _.each(this.notifications, (n: any) => { if(n.id == this.currentNotifId) n.is_read = !n.is_read;});
        },
        (error: any) => {
          console.log('error', error);
        });
  }

  markAsRead(notification: any) {
    // Mark this notification as read
    if ( !notification.is_read )
      this.toggleReadStatus(notification);
  }

  toggleAllReadStatus() {
    this.api.post(`${Constants.urls.zoneSoNotifications}/toggle_all_read_status`, [])
      .filter(() => this.userService.loggedIn) // Do not call this API if user is not logged in
      .subscribe(
        (result: any) => {
          let overallReadStatus = result.data;
          _.each(this.notifications, (n: any) => {n.is_read = overallReadStatus ;});

        },
        (error: any) => {
          console.log('error', error);
        });
  }

  getLatestNotifications() {
    if (!_.isEmpty(this.nextLink))
      return; // Only load once at first time
    this.api.get(`${Constants.urls.zoneSoNotifications}/get_latest`, {sort_name: 'created_at'})
      .filter((x: any) => this.userService.loggedIn) // Do not call this API if user is not logged in
      .subscribe(
        (result: any) => {
          _.remove(this.notifications); // Make sure this.notifications has no value before assigning
          this.notifications = result.data;
          this.nextLink = result.page_metadata.links.next;

          // Get latest notification id
          this.latestNotifId = Math.max(..._.map(this.notifications, (n: any) => n.id));

          console.log('latest Notif Id: ', this.latestNotifId);
          if (result.data.length==0) {
            this.hasObjects = false;
          }
        },
        (error: any) => {
          console.log('error', error);
        });
  }

  getMoreNotifications() {
    // if(this.loadingDone) {
    if(_.isEmpty(this.nextLink)) {
      console.debug('All notifications are loaded !');
      return;
    }
    this.api.get(this.nextLink)
      .filter(() => this.userService.loggedIn) // Do not call this API if user is not logged in
      .subscribe(
        (result: any) => {
          this.notifications.push(...result.data);
          this.newNotifCount -= result.data.length;
          this.newNotifCount = (this.newNotifCount < 0 ) ? 0 : this.newNotifCount ;

          this.nextLink = result.page_metadata.links.next;
          if (result.data.length==0) {
            this.hasObjects = false;
          }
          this.markAsSeen();
        },
        (error: any) => {
          console.log('error', error);
        });
  }

  getNewNotificationsCount(callback?: any) {
    // Only loading 1 time when refreshing pages or navigating from login pages
    this.api.get(`${Constants.urls.zoneSoNotifications}/get_new_notifications/count`)
      .filter(() => this.userService.loggedIn) // Do not call this API if user is not logged in
      .take(1)
      .subscribe(
        (result: any) => {
          this.newNotifCount = result.data;

          if(callback)
            callback();
        },
        (error: any) => {
          console.log('error', error);
        });
  }

  getNewNotificationsCountObs(): Observable<any> {
    // Only loading 1 time when refreshing pages or navigating from login pages
    return this.api.get(`${Constants.urls.zoneSoNotifications}/get_new_notifications/count`)
      .filter(() => this.userService.loggedIn) // Do not call this API if user is not logged in
      .take(1);
  }

  hideNotification(notification: any) {
    this.currentNotifId = notification.id;
    this.api.delete(`${Constants.urls.zoneSoNotifications}/${this.currentNotifId}`)
      .subscribe((result: any) => {
          // _.remove(this.notifications, {id: this.currentNotifId}); // Remove current notification
          console.log('result: ', result);
        },
        (error: any) => {
          console.log('error', error);
        });
  }

  moveToTrash(notification: any) {
    this.trashNotifications.push(notification);
  }

  // Remove notification that exists in TrashNotifications
  removeNotifications() {
    _.pullAll(this.notifications, this.trashNotifications);
    this.trashNotifications.length = 0 ;
  }

  countNewNotifications() {
    let temp_notif_count = _.filter(this.notifications, (n: any) => n.seen_state == Constants.seenStatus.new).length;
    if (temp_notif_count > 0)
      this.newNotifCount -= temp_notif_count;
    this.newNotifCount = (this.newNotifCount < 0 ? 0 : this.newNotifCount);
  }

  undoNotification(notification: any) {
    // _.remove(this.trashNotifications, (n:any) => n.id == notification.id);
    return this.api.post(`${Constants.urls.zoneSoNotifications}`, notification).take(1);
  }


  startChannel(callback?: any) {

    // Work-around to fix loading performance issue by delaying following actions in 2s. Should be updated later
    let timeoutId = setTimeout(() => {
      this.getNewNotificationsCount();

      this.notificationChannel.createSubscription();

      if( this.notificationChannel.notificationUpdated) {
        this.notificationChannel.notificationUpdated
          .subscribe(
            (notification: any) => {
              // this.notifications.unshift(JSON.parse(notification));
              // this.newNotifCount++;
              this.addNewNofification(notification);

              if(callback) {
                let to2 = setTimeout(callback(), 1000); // Delay 1s before subscribing to appearance channel

              }

            });
      }}, 2000);

  }
}




