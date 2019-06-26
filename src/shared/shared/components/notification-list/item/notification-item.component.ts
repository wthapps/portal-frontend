import {
  Component,
  OnInit,
  Input,
  HostBinding,
  ViewContainerRef,
  ViewChild,
  ElementRef,
  HostListener,
  Renderer2
} from '@angular/core';
import { NotificationUndoComponent } from '@shared/shared/components/notification-list/undo/notification-undo.component';
import { Router } from '@angular/router';
import { NotificationService, ApiBaseService } from '@shared/services';
import { ConnectionNotificationService } from '@wth/shared/services/connection-notification.service';
import { Constants } from '@shared/constant';

declare let _: any;
declare let $: any;

@Component({
  selector: 'notification-item',
  templateUrl: 'notification-item.component.html',
  styleUrls: ['./notification-item.component.scss'],
  entryComponents: [NotificationUndoComponent]
})

export class NotificationItemComponent implements OnInit {
  @ViewChild('notificationUndo', {read: ViewContainerRef}) undoNotificationRef: ViewContainerRef;
  // @ViewChild('notiItemMenuEl') notiItemMenuEl: ElementRef;
  @Input() notification: any;
  @Input() type = 'update';
  @Input() inDropdown = false;

  @HostBinding('class') classes = 'notification-item';
  itemSettings: any = {};
  showToggle: boolean;
  modules: string[] = ['', 'social', 'chat', 'media', 'portal', 'contact', 'note', 'profile'];
  readonly tooltip = Constants.tooltip;
  // Should be consistent with Constants.moduleMap


  constructor(public notificationService: NotificationService,
              public connectionService: ConnectionNotificationService,
              private router: Router,
              private apiBaseService: ApiBaseService,
              private elementRef: ElementRef,
              private renderer: Renderer2) {

  }

  ngOnInit(): void {
  }

  subToggle(e: any) {
    console.log('inside sub toggle ...', e);
    e.stopPropagation();
    e.preventDefault();

    $(e.target)
      .next('ul')
      .toggle();
    $('#nav-notification-list')
      .find('ul.dropdown-menu')
      .not($(e.target).next('ul'))
      .hide();
  }


  hideNotificationById(id: any) {
    if (this.type === 'connection')
      this.connectionService.hideNotificationById(id);
    else
      this.notificationService.hideNotificationById(id);
  }

  toggleNotificationById(id) {
    console.log(id);
  }

  viewProfile(user: any) {
    this.router.navigate(['/profile', user.uuid]);
  }

  markAsUnread(notification) {
    console.log('mark as unread, ', notification);
    if (this.type === 'connection')
      this.connectionService.markAsRead(notification);
    else
      this.notificationService.markAsRead(notification);
  }

  toggleNotification() {
    switch (this.notification.object_type) {
      case 'SocialNetwork::Post':
        if (_.get(this.notification, 'object.uuid')) {
          this.apiBaseService.post(`${this.apiBaseService.urls.zoneSoPosts}/toggle_post_notification`,
           {uuid: _.get(this.notification, 'object.uuid')})
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


  toggleReadStatus(notification: any) {
    if (this.type === 'connection')
      this.connectionService.toggleReadStatus(notification);
    else
      this.notificationService.toggleReadStatus(notification);
  }

  doAction(action: any, notif_id: string) {
    if (this.type === 'connection')
      this.connectionService.doAction(action, notif_id);
    else
      this.notificationService.doAction(action, notif_id);
  }

  navigateTo(actions: any[], notif_id: string): void {
    if (this.type === 'connection')
      this.connectionService.navigateTo(actions, notif_id);
    else
      this.notificationService.navigateTo(actions, notif_id);
  }

  navigateToSocial(urls: string[]) {
    if (this.type === 'connection')
      this.connectionService.navigateToSocial(urls);
    else
      this.notificationService.navigateToSocial(urls);
  }
}
