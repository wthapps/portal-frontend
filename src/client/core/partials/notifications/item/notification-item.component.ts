import { Component, Input, HostBinding, ViewChild, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { UndoNotificationComponent } from '../../header/notification/undo-notification.component';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  moduleId: module.id,
  selector: 'notification-item',
  templateUrl: 'notification-item.component.html',
  styleUrls: ['notification-item.component.css'],
  entryComponents: [UndoNotificationComponent]
})

export class NotificationItemComponent {
  @ViewChild('undo_notification', {read: ViewContainerRef}) undoNotificationRef: ViewContainerRef;
  @HostBinding('class') classes: string = 'list-group list-notifications';
  @Input() size: string = 'default';
  @Input() notification: any;

  selectedNotifications: string[] = ['social'];
  communitiesUrl: string;


  constructor( public notificationService: NotificationService) {
  }


  confirmHideNotification(notification:any) {
    console.debug('inside notification-item: confirmHideNotification !!!');
    // this.notification.isHidden = true;
    this.hideNotification(notification);
    // this.createUndoNotificationForm(notification);
  }

  getMoreNotifications() {
    this.notificationService.getMoreNotifications();
  }

  hideNotification(notification: any) {
    this.notificationService.hideNotification(notification);
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

  open() {
    // this.modal.open();
  }

  save() {
    console.log(this.selectedNotifications);
  }
}
