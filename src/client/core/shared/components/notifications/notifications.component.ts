import { Component, Input, HostBinding, ViewChild } from '@angular/core';
import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { NotificationService } from '../../services/notification.service';
import { Constants } from '../../config/constants';

@Component({
  moduleId: module.id,
  selector: 'partials-notifications',
  templateUrl: 'notifications.component.html',
  styleUrls: ['notifications.component.css']
})

export class PartialsNotificationsComponent {
  @HostBinding('class') classes: string = 'list-group list-notifications';

  @Input() size: string = 'default';
  @ViewChild('modal') modal: ModalComponent;

  selectedNotifications: string[] = ['social'];
  communitiesUrl: string;

  tooltip: any = Constants.tooltip;

  constructor(public notificationService: NotificationService) {
  }

  getMoreNotifications() {
    this.notificationService.getMoreNotifications();
  }

  hideNotification(notification: any) {
    this.notificationService.hideNotification(notification);
  }

  confirmHideNotification(notification: any) {
    console.debug('inside partials-notifications: confirmHideNotification !!!');
    // notification.isHidden = true;
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

  // toggleAllReadStatus() {
  //   this.notificationService.toggleAllReadStatus();
  // }

  markAllAsRead() {
    this.notificationService.markAllAsRead();
  }

  doAction(action: any, notif_id: string) {
    this.notificationService.doAction(action, notif_id);
  }

  open() {
    this.modal.open();
  }

  save() {
    console.log(this.selectedNotifications);
  }
}
