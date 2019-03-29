import { Injectable, EventEmitter } from '@angular/core';
import { filter } from 'rxjs/operators';

import { ApiBaseService } from './apibase.service';
import { Constants } from '../constant/config/constants';
import { WTHNavigateService } from './wth-navigate.service';
import { AuthService } from '@wth/shared/services';

/**
 * Created by phat on 18/11/2016.
 */

declare var _: any;

export class CommonNotificationInterface {
  notifications: Array<any> = new Array<any>();
  latestNotifId = 0;
  newNotifCount = 0;
  currentNotifId: any;
  nextLink: string;
  loadingDone = false;
  initLoad = false;
  hasObjects: boolean;
  outEvent: EventEmitter<any> = new EventEmitter();
  url: string = Constants.urls.zoneSoNotifications;

  constructor(
    protected api: ApiBaseService,
    protected navigateService: WTHNavigateService,
    protected authService: AuthService
  ) {}

  get() {
    return this.api.get(`${this.url}`).pipe(filter(() => this.authService.loggedIn)); // Do not call this API if user is not logged in
  }

  doAction(action: any, notif_id: string) {
    const link: string = action.link;
    const method = action.method;
    const params = action.params;
    const method_name = action.name;
    const module = action.module; // media, social, chat | 1, 2, 3 ...
    const body = {
      url: link
      // method: method
    };
    Object.assign(body, params);
    this.currentNotifId = notif_id;

    switch (method) {
      case 'navigate':
        this.navigateService.navigateOrRedirect(link, module, body);
        const currentNotif = _.find(this.notifications, {
          id: this.currentNotifId
        });
        this.markAsRead(currentNotif);

        break;
      case 'post':
        this.api
          .post(link, body)
          .toPromise()
          .then(
            (result: any) => {
              this.notifications = _.map(this.notifications, (notif: any) => {
                if (notif.id === this.currentNotifId) {
                  return Object.assign(notif, {
                    actions: _.get(result, 'data.actions', []),
                    response_actions: _.get(result, 'data.response_actions', [])
                  });
                } else { return notif; }
              });
            },
            (error: any) => {
              console.log('error', error);
            }
          );
        break;

      case 'delete':
        this.api
          .delete(action.link)
          .toPromise()
          .then(
            (result: any) => {
              console.log('Notification service deleted');
              _.remove(this.notifications, { id: this.currentNotifId }); // Remove current notification
            },
            (error: any) => {
              console.log('error', error);
            }
          );
        break;
      default:
        console.log(
          'error',
          'DoAction: Unhandled method ' +
            method +
            ' with method name: ' +
            method_name
        );
    }
  }

  navigateTo(actions: any[], notif_id: string): void {
    if (_.get(actions[0], 'name') === 'view') {
      this.doAction(actions[0], notif_id);
    }
  }

  navigateToSocial(urls: string[]) {
    const link: string = urls.join('/');
    this.navigateService.navigateOrRedirect(link, 'social');
  }

  markAsSeen() {
    // this.notificationService.markAsSeen(this.notifications)
    const notif_ids = _.map(this.notifications, (i: any) => i.id);
    const body = { ids: notif_ids };

    if (!(this.authService.loggedIn && this.authService.user)) { return; }
    return this.api
      .post(`${this.url}/mark_as_seen`, body)
      .pipe(filter(() => this.authService.loggedIn)) // Do not call this API if user is not logged in
      .subscribe(
        (result: any) => {
          this.countNewNotifications();
          _.each(
            this.notifications,
            (i: any) => (i.seen_state = Constants.seenStatus.seen)
          );
        },
        (error: any) => {
          console.log('error', error);
        }
      );
  }

  addNewNofification(notification: any) {
    // Detect if this notification is new or an Undo notification
    if (
      parseInt(_.get(JSON.parse(notification.data), 'id'), 10) > this.latestNotifId
    ) {
      this.notifications.unshift(JSON.parse(notification.data));
      this.newNotifCount++;
    }
  }

  toggleReadStatus(notification: any) {
    this.currentNotifId = notification.id;
    const body = { ids: this.currentNotifId };
    return this.api
      .post(`${this.url}/toggle_read_status`, body)
      .pipe(filter(() => this.authService.loggedIn)) // Do not call this API if user is not logged in
      .toPromise()
      .then(
        (result: any) => {
          _.each(this.notifications, (n: any) => {
            if (n.id === this.currentNotifId) { n.is_read = !n.is_read; }
          });
        },
        (error: any) => {
          console.log('error', error);
        }
      );
  }

  markAsRead(notification: any) {
    // Mark this notification as read
    if (notification) {
      this.toggleReadStatus(notification);
    }
  }

  markAllAsRead() {
    this.api
      .post(`${this.url}/mark_all_as_read`, [])
      .pipe(filter(() => this.authService.loggedIn)) // Do not call this API if user is not logged in
      .toPromise()
      .then(
        (result: any) => {
          _.each(this.notifications, (n: any) => {
            n.is_read = true;
          });
        },
        (error: any) => {
          console.log('error', error);
        }
      );
  }

  getDisconnectedNotifications(): Promise<any> {
    if (!(this.authService.loggedIn && this.authService.user)) {
      return Promise.reject(new Error('user does not log in yet'));
    }
    const options = { sort_name: 'created_at' };
    if (this.notifications.length > 0) {
      const last = this.notifications[0];
      Object.assign(options, {last_id: last.id});
    }
    return this.api
      .get(`${this.url}/get_latest`, options)
      .toPromise()
      .then(rs => {
        this.notifications.push(...rs.data);
      });
  }

  getLatestNotifications(): void {
    if (
      !(this.authService.loggedIn && this.authService.user)
    ) {
      throw new Error('user does not log in yet');
    }
    this.api
      .get(`${this.url}/get_latest`, { sort_name: 'created_at' })
      .toPromise()
      .then(
        (result: any) => {
          // _.remove(this.notifications); // Make sure this.notifications has no value before assigning
          this.notifications = [...result.data];
          this.newNotifCount = 0;
          this.nextLink = result.meta.links.next;
          if (_.isEmpty(this.nextLink)) { this.loadingDone = true; }

          // Get latest notification id
          if (this.notifications.length !== 0) {
            this.latestNotifId = Math.max(
              ..._.map(this.notifications, (n: any) => +n.id)
            );
          } else { this.latestNotifId = -99; }

          if (result.data.length === 0) {
            this.hasObjects = false;
          }
          this.initLoad = true;
        },
        (error: any) => {
          console.log('error', error);
        }
      );
  }

  getMoreNotifications() {
    // if(this.loadingDone) {
    if (this.loadingDone || !this.nextLink) {
      this.loadingDone = true;
      return;
    }
    if (!(this.authService.loggedIn && this.authService.user)) { return; }
    this.api
      .get(this.nextLink)
      .toPromise()
      .then(
        (result: any) => {
          this.notifications.push(...result.data);
          this.newNotifCount -= result.data.length;
          this.newNotifCount = this.newNotifCount < 0 ? 0 : this.newNotifCount;

          this.nextLink = result.meta.links.next;
          if (result.data.length === 0) {
            this.hasObjects = false;
          }
          this.markAsSeen();
        },
        (error: any) => {
          console.log('error', error);
        }
      );
  }

  hideNotificationById(id: any) {
    this.api
      .delete(`${this.url}/${id}`)
      .toPromise()
      .then(
        (result: any) => {
          const idx = _.findIndex(this.notifications, ['id', +id]);
          console.log(`hideNotification: ${idx} `, id, this.notifications);
          if (idx > -1) {
            this.notifications = [...this.notifications];
            this.notifications[idx].isHidden = true;
          }
        },
        (error: any) => {
          console.log('error', error);
        }
      );
  }

  hideNotification(notification: any) {
    this.currentNotifId = notification.id;
    // this.api.delete(`${this.url}/${this.currentNotifId}`)
    //   .toPromise().then((result: any) => {
    //     let idx = _.findIndex(this.notifications, ['id', notification.id]);
    //     console.log(`hideNotification: ${idx} `, notification);
    //     if (idx > -1)
    //       this.notifications[idx].isHidden = true;
    //   },
    //   (error: any) => {
    //     console.log('error', error);
    //   });
  }

  countNewNotifications() {
    const temp_notif_count = _.filter(
      this.notifications,
      (n: any) => n.seen_state === Constants.seenStatus.new
    ).length;
    if (temp_notif_count > 0) { this.newNotifCount -= temp_notif_count; }
    this.newNotifCount = this.newNotifCount < 0 ? 0 : this.newNotifCount;
  }

  undoNotification(notification: any) {
    this.api
      .post(`${this.url}/restore`, notification)
      .toPromise()
      .then(() => {
        const idx = _.findIndex(this.notifications, ['id', +notification.id]);
        if (idx > -1) { this.notifications[idx].isHidden = false; }
      });
  }
}
