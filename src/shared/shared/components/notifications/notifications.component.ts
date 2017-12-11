import { Component, Input, HostBinding, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { ModalComponent } from 'ng2-bs3-modal/components/modal';

import { NotificationService } from '../../services/notification.service';
import { Constants } from '../../../constant/config/constants';
import { ApiBaseService } from '../../services/apibase.service';

@Component({
    selector: 'partials-notifications',
  templateUrl: 'notifications.component.html',
  styleUrls: ['notifications.component.scss']
})

export class PartialsNotificationsComponent {
  @HostBinding('class') classes: string = 'list-group list-notifications';

  @Input() size: string = 'default';
  @ViewChild('modal') modal: ModalComponent;

  selectedNotifications: string[] = ['social'];
  communitiesUrl: string;
  showToggle: boolean;
  itemSettings: any;

  tooltip: any = Constants.tooltip;

  constructor(public notificationService: NotificationService,
              private router: Router,
              private apiBaseService: ApiBaseService) {
  }

  getMoreNotifications() {
    this.notificationService.getMoreNotifications();
  }

  hideNotification(notification: any) {
    this.notificationService.hideNotification(notification);
  }

  viewProfile(user: any) {
    this.router.navigate(['/profile', user.uuid]);
  }

  toggleNotification(notification: any) {
    switch (notification.object_type) {
      case 'SocialNetwork::Post':
        this.apiBaseService.post(`${this.apiBaseService.urls.zoneSoPosts}/toggle_post_notification`, {uuid: notification.object.uuid})
          .toPromise()
          .then((res: any) => {
            this.itemSettings = res.data;
          });
        break;
      case 'SocialNetwork::Comment':
        // TODO
        break;
      default:
        console.log('toggleNotification  - unhandle object type');
    }
  }

  getItemSettings(notification: any) {
    switch (notification.object_type) {
      case 'SocialNetwork::Post':
        this.apiBaseService.get(`${this.apiBaseService.urls.zoneSoPostSettings}/${notification.object.uuid}`)
          .toPromise().then(
          (res: any) => {
            this.itemSettings = res.data.settings;
          });
        break;
      case 'SocialNetwork::Comment':
        // TODO
        break;
      default:
        console.log('getItemSettings  - unhandle object type');
    }
  }

  confirmHideNotification(notification: any) {
    this.hideNotification(notification);
  }

  toggleViewNotifications() {
    this.notificationService.getLatestNotifications(); // Load latest notifications in the first click
    if (this.notificationService.notifications.length <= 0) {
      this.getMoreNotifications();
    }
    this.markAsSeen();
  }

  markAsSeen() {
    this.notificationService.markAsSeen();
  }

  toggleReadStatus(notification: any) {
    this.notificationService.toggleReadStatus(notification);
  }

  markAllAsRead() {
    this.notificationService.markAllAsRead();
  }

  doAction(action: any, notif_id: string) {
    this.notificationService.doAction(action, notif_id);
  }

  navigateTo(actions: any[], notif_id: string): void {
    this.notificationService.navigateTo(actions, notif_id);
  }

  navigateToSocial(urls: string[]) {
    this.notificationService.navigateToSocial(urls);
  }

  open() {
    this.modal.open();
  }

  save() {
    console.log(this.selectedNotifications);
  }
}
