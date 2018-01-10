import {
  Component,
  OnInit,
  Input,
  ViewEncapsulation,
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

declare let _: any;

@Component({
  selector: 'notification-item',
  templateUrl: 'notification-item.component.html',
  styleUrls: ['notification-item.component.scss'],
  encapsulation: ViewEncapsulation.None,
  entryComponents: [NotificationUndoComponent]
})

export class NotificationItemComponent implements OnInit {
  @ViewChild('notificationUndo', {read: ViewContainerRef}) undoNotificationRef: ViewContainerRef;
  @ViewChild('notiItemMenuEl') notiItemMenuEl: ElementRef;
  @Input() notification: any;
  @Input() type: string = 'update';

  @HostBinding('class') classes: string = 'notification-item';
  selectedNotifications: string[] = ['social'];
  communitiesUrl: string;
  itemSettings: any = {};
  showToggle: boolean;

  @HostListener('document:click', ['$event']) clickedOutside(event: Event) {
    // here you can hide your menu
    const tmpOld = document.getElementById('notiItemMenuEl');
    if (tmpOld) {
      this.renderer.removeChild(document.body, tmpOld);
    }
  }

  constructor(public notificationService: NotificationService,
              public connectionService: ConnectionNotificationService,
              private router: Router,
              private apiBaseService: ApiBaseService,
              private elementRef: ElementRef,
              private renderer: Renderer2) {
  }

  ngOnInit(): void {
  }

  clickedInside(event: Event) {
    event.preventDefault();
    event.stopPropagation();
  }

  showMenu(event: any) {
    const tmpOld = document.getElementById('notiItemMenuEl');
    if (tmpOld) {
      this.renderer.removeChild(document.body, tmpOld);
    }
    const el = this.notiItemMenuEl.nativeElement.cloneNode(true);
    const tmp = document.createElement('div');
    tmp.setAttribute('id', 'notiItemMenuEl');
    tmp.appendChild(el);
    if(tmp.querySelector('.js-confirmHideNotification') !== null) {
      tmp.querySelector('.js-confirmHideNotification').addEventListener('click', (e: any) => {
        console.debug('.js-confirmHideNotification LCICKED', e);
        this.hideNotificationById(e.currentTarget.id);
      });
    }

    if(tmp.querySelector('.js-toggleNotification') !== null) {
      tmp.querySelector('.js-toggleNotification').addEventListener('click', (e: any) => {
        console.debug('.js-toggleNotification CICKED', e);
        this.toggleNotificationById(e.currentTarget.id);
      });
    }

    // $('body').on('click', '#notiItemMenuEl .js-confirmHideNotification', (e: any) => {
    //   console.debug('_this.hideNotificationById');
    //   // _this.hideNotificationById(e.currentTarget.id);
    // });
    //
    // $('body').on('click', '#notiItemMenuEl .js-toggleNotification', (e: any) => {
    //   _this.toggleNotificationById(e.currentTarget.id);
    // });


    this.renderer.appendChild(document.body, tmp);
    this.renderer.setStyle(tmp, 'top', event.clientY + 'px');
    this.renderer.setStyle(tmp, 'left', event.clientX + 'px');
  }

  // navigateTo(actions: any[], notif_id: string): void {
  //   this.notificationService.navigateTo(actions, notif_id);
  // }


  hideNotificationById(id: any) {
    if(this.type === 'connection')
      this.connectionService.hideNotificationById(id);
    else
      this.notificationService.hideNotificationById(id);
  }

  toggleNotificationById(id) {
    console.log(id);
  }

  confirmHideNotification(notification: any) {
    // this.hideNotification(notification);
  }

  hideNotification(notification: any) {
    // if(this.type === 'connection')
    //   this.connectionService.hideNotification(notification);
    // else
    //   this.notificationService.hideNotification(notification);
  }

  viewProfile(user: any) {
    this.router.navigate(['/profile', user.uuid]);
  }

  // TODO:
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


  toggleReadStatus(notification: any) {
    if(this.type === 'connection')
      this.connectionService.toggleReadStatus(notification);
    else
      this.notificationService.toggleReadStatus(notification);
  }

  doAction(action: any, notif_id: string) {
    if(this.type === 'connection')
      this.connectionService.doAction(action, notif_id);
    else
      this.notificationService.doAction(action, notif_id);
  }

  navigateTo(actions: any[], notif_id: string): void {
    if(this.type === 'connection')
      this.connectionService.navigateTo(actions, notif_id);
    else
      this.notificationService.navigateTo(actions, notif_id);
  }

  navigateToSocial(urls: string[]) {
    if(this.type === 'connection')
      this.connectionService.navigateToSocial(urls);
    else
      this.notificationService.navigateToSocial(urls);
  }
}
