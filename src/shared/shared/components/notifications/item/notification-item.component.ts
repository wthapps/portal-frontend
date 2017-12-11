import {
  Component, Input, HostBinding, ViewChild, ViewContainerRef,
  OnInit
} from '@angular/core';
import { Router } from '@angular/router';

import { NotificationService } from '../../../../services/notification.service';
import { UndoNotificationComponent } from '../undo-notification.component';
import { ApiBaseService } from '../../../../services/apibase.service';

declare let _: any;

@Component({
    selector: 'notification-item',
  templateUrl: 'notification-item.component.html',
  styleUrls: ['notification-item.component.scss'],
  entryComponents: [UndoNotificationComponent]
})

export class NotificationItemComponent implements OnInit {
  @ViewChild('undo_notification', {read: ViewContainerRef}) undoNotificationRef: ViewContainerRef;
  @HostBinding('class') classes: string = 'list-group list-notifications';
  @Input() size: string = 'default';
  @Input() notification: any;

  selectedNotifications: string[] = ['social'];
  communitiesUrl: string;
  itemSettings: any = {};
  showToggle: boolean;

  constructor(public notificationService: NotificationService,
              private router: Router,
              private apiBaseService: ApiBaseService
  ) {
  }

  ngOnInit() {
    if(this.notification.object_type === 'SocialNetwork::Post')
      this.showToggle = true;
  }

  confirmHideNotification(notification: any) {
    this.hideNotification(notification);
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

  toggleNotification() {
    switch (this.notification.object_type) {
      case 'SocialNetwork::Post':
        if(_.get(this.notification, 'object.uuid')) {
          this.apiBaseService.post(`${this.apiBaseService.urls.zoneSoPosts}/toggle_post_notification`, {uuid: _.get(this.notification, 'object.uuid')})
            .toPromise()
            .then((res: any) => {
              this.itemSettings = res.data;
            });
        } else {
          console.error('No uuid found in notification: ', this.notification);
        }
        break;
      case 'SocialNetwork::Comment':
        // TODO
        break;
      default:
        console.log('toggleNotification  - unhandle object type');
    }
  }

  getItemSettings() {
    switch (this.notification.object_type) {
      case 'SocialNetwork::Post':
        console.debug('getItemSettings - object uuid: ', this.notification.object.uuid);
        this.apiBaseService.get(`${this.apiBaseService.urls.zoneSoPostSettings}/${this.notification.object.uuid}`)
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
    // this.modal.open();
  }

  save() {
    console.log(this.selectedNotifications);
  }
}
