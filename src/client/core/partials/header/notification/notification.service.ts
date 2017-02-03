import { Injectable } from '@angular/core';
import { ApiBaseService } from '../../../shared/services/apibase.service';

/**
 * Created by phat on 18/11/2016.
 */

declare  var _: any;

@Injectable()
export class NotificationService {

  constructor(private api: ApiBaseService) {
  }

  get() {
    return this.api.get(`zone/social_network/notifications`);
  }

  getLatestNotifications(offset: number, limit: number) {
    return this.api.get(`zone/social_network/notifications/get_latest/` + offset + `/` + limit);
  }

  hideNotification(notification: any) {
    let notif_id = notification.id;
    return this.api.delete(`zone/social_network/notifications/` + notif_id);
  }

  turnOffNotification(notification: any) {
    // TODO
  }

  getNewNotificationsCount(){
    return this.api.get(`zone/social_network/notifications/get_new_notifications/count`);
  }

  markAsSeen(notifications: any) {

    let notif_ids = _.map(notifications, (i: any) => i.id);
    let body = {"ids" : notif_ids};

    // TODO: Convert this method to put
    return this.api.post(`zone/social_network/notifications/mark_as_seen`, body);
  }

  toggleReadStatus(notif_ids: any) {
    let body = {"ids" : notif_ids};
    return this.api.post(`zone/social_network/notifications/toggle_read_status`, body);
  }

  toggleAllReadStatus() {
    return this.api.post(`zone/social_network/notifications/toggle_all_read_status`, []);
  }



  viewAllNotifications() {
    return this.api.get(`zone/social_network/notifications`);
  }
}




