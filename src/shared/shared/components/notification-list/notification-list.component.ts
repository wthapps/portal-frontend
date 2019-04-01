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
  @Input() type = 'update'; // update, connection
  @Input() size = 'sm'; // xs, sm, md, lg
  @Input() notifications: any[] = [];
  @Input() inDropdown = false;
  @ViewChild('settingModal') settingModal: NotificationSettingModalComponent;


  constructor(public notificationService: NotificationService,
              public connectionService: ConnectionNotificationService) {
  }

  trackByFn(index, notification) {
    return notification ? notification.id : index;
  }
}
