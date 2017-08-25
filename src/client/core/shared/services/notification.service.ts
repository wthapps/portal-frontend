import { Injectable, EventEmitter } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';

import { ApiBaseService } from '../services/apibase.service';
import { Constants } from '../config/constants';
import { NotificationChannelService } from '../channels/notification-channel.service';
import { UserService } from './user.service';
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
  loadingDone: boolean = false;
  hasObjects: boolean;
  outEvent: EventEmitter<any> = new EventEmitter();
  inEvent: EventEmitter<any> = new EventEmitter();

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
          .toPromise().then((result: any) => {
              this.notifications = _.map(this.notifications, (notif: any) => {
                if(notif.id === this.currentNotifId)
                  return Object.assign(notif, {actions: _.get(result, 'data.actions', []), response_actions: _.get(result, 'data.response_actions', [])});
                else
                  return notif;
              });
              console.debug('post - ', this.notifications);
            },
            (error: any) => {
              console.log('error', error);
            });
        break;

      case 'delete':
        this.api.delete(action.link)
          .toPromise().then((result: any) => {
            console.log('Notification service deleted');
            _.remove(this.notifications, {id: this.currentNotifId}); // Remove current notification
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
    if (parseInt(_.get(JSON.parse(notification.data), 'id')) > this.latestNotifId) {
      this.notifications.unshift(JSON.parse(notification.data));
      this.newNotifCount++;
    }
  }

  toggleReadStatus(notification: any) {
    this.currentNotifId = notification.id;
    let body = {'ids' : this.currentNotifId};
    return this.api.post(`${Constants.urls.zoneSoNotifications}/toggle_read_status`, body)
      .filter(() => this.userService.loggedIn) // Do not call this API if user is not logged in
      .toPromise().then(
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

  markAllAsRead() {
    this.api.post(`${Constants.urls.zoneSoNotifications}/mark_all_as_read`, [])
      .filter(() => this.userService.loggedIn) // Do not call this API if user is not logged in
      .toPromise().then(
        (result: any) => {
          _.each(this.notifications, (n: any) => {n.is_read = true ;});

        },
        (error: any) => {
          console.log('error', error);
        });
  }

  getLatestNotifications() {
    if (this.loadingDone)
      return; // Only load once at first time
    this.api.get(`${Constants.urls.zoneSoNotifications}/get_latest`, {sort_name: 'created_at'})
      .filter((x: any) => this.userService.loggedIn) // Do not call this API if user is not logged in
      .toPromise().then(
        (result: any) => {
          _.remove(this.notifications); // Make sure this.notifications has no value before assigning
          this.notifications = result.data;
          this.nextLink = result.page_metadata.links.next;
          if (_.isEmpty(this.nextLink))
            this.loadingDone = true;

          // Get latest notification id
          if (this.notifications.length != 0)
            this.latestNotifId = Math.max(..._.map(this.notifications, (n: any) => n.id));
          else
            this.latestNotifId = -99;

          console.log('latest Notif Id: ', this.latestNotifId);
          if (result.data.length==0) {
            this.hasObjects = false;
          }
        },
        (error: any) => {
          console.log('error', error);
        });
  }

  isLoadingDone() {
    return this.loadingDone ;
  }

  getMoreNotifications() {
    // if(this.loadingDone) {
    if(this.isLoadingDone() || this.nextLink === undefined) {
      console.debug('All notifications are loaded !');
      return;
    }
    this.api.get(this.nextLink)
      .filter(() => this.userService.loggedIn) // Do not call this API if user is not logged in
      .toPromise().then(
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
      .toPromise().then(
        (result: any) => {
          this.newNotifCount = result.data;

          if(callback)
            callback();
        },
        (error: any) => {
          console.log('error', error);
        });
  }

  hideNotification(notification: any) {
    this.currentNotifId = notification.id;
    this.api.delete(`${Constants.urls.zoneSoNotifications}/${this.currentNotifId}`)
      .toPromise().then((result: any) => {
          let idx = _.findIndex(this.notifications, ['id', notification.id]);
          console.log(`hideNotification: ${idx} `, notification);
          if (idx > -1)
            this.notifications[idx].isHidden = true;
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
    this.api.post(`${Constants.urls.zoneSoNotifications}/restore`, notification).toPromise()
      .then(() => {
      let idx = _.findIndex(this.notifications, ['id', notification.id]);
      if (idx > -1)
        this.notifications[idx].isHidden = false;
    });
  }


  startChannel(callback?: any) {
    // Work-around to fix loading performance issue by delaying following actions in 2s. Should be updated later
    setTimeout(() => {
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
                setTimeout(callback(), 1000); // Delay 1s before subscribing to appearance channel

              }

            });
      }}, 2000);

  }
}




