import {
  Component, Input, HostBinding, ViewChild, ViewContainerRef,
  OnInit
} from '@angular/core';
import { NotificationService } from '../../../services/notification.service';
import { UndoNotificationComponent } from '../undo-notification.component';
import { ApiBaseService } from '../../../services/apibase.service';

@Component({
  moduleId: module.id,
  selector: 'notification-item',
  templateUrl: 'notification-item.component.html',
  styleUrls: ['notification-item.component.css'],
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
              private apiBaseService: ApiBaseService
  ) {
  }

  ngOnInit() {
    if(this.notification.object_type === 'SocialNetwork::Post')
      this.showToggle = true;
  }

  confirmHideNotification(notification: any) {
    console.debug('inside notification-item: confirmHideNotification !!!');
    this.hideNotification(notification);
  }

  getMoreNotifications() {
    this.notificationService.getMoreNotifications();
  }

  hideNotification(notification: any) {
    this.notificationService.hideNotification(notification);
  }

  toggleNotification() {
    switch (this.notification.object_type) {
      case 'SocialNetwork::Post':
        console.debug('toggleNotification - object uuid: ', this.notification.object.uuid);
        this.apiBaseService.post(`${this.apiBaseService.urls.zoneSoPosts}/toggle_post_notification`, {uuid: this.notification.object.uuid})
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

  open() {
    // this.modal.open();
  }

  save() {
    console.log(this.selectedNotifications);
  }
}
