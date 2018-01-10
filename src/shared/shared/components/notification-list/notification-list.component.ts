import { Component, OnInit, Input, ViewEncapsulation, AfterViewInit, ViewChild } from '@angular/core';
import { NotificationService } from '@shared/services';
import { ConnectionNotificationService } from '@wth/shared/services/connection-notification.service';
import { NotificationSettingModalComponent } from '@shared/shared/components/notification-list/modal/modal.component';

declare let $: any;

@Component({
  selector: 'app-partials-notification-list',
  templateUrl: 'notification-list.component.html',
  styleUrls: ['notification-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class NotificationListComponent {
  @Input() type: string = 'update'; // update, connection
  @Input() size: string = 'sm'; // xs, sm, md, lg
  @Input() notifications: any[] = [];
  @ViewChild('settingModal') settingModal: NotificationSettingModalComponent;


  constructor(public notificationService: NotificationService,
              public connectionService: ConnectionNotificationService) {
  }
}
