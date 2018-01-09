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

export class NotificationListComponent implements OnInit, AfterViewInit {
  @Input() type: string = 'update'; // update, connection
  @Input() size: string = 'sm'; // xs, sm, md, lg
  @Input() notifications: any[] = [];
  @ViewChild('settingModal') settingModal: NotificationSettingModalComponent;


  constructor(public notificationService: NotificationService,
              public connectionService: ConnectionNotificationService) {

  constructor(public notificationService: NotificationService) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    const _this = this;

    $('body').on('click', '.js-confirmHideNotification', (e: any) => {
      _this.hideNotificationById(e.currentTarget.id);
    });

    $('body').on('click', '.js-toggleNotification', (e: any) => {
      _this.toggleNotificationById(e.currentTarget.id);
    });
  }

  hideNotificationById(id: any) {
    if(this.type === 'connection')
      this.connectionService.hideNotificationById(id);
    else
      this.notificationService.hideNotificationById(id);
  }

  toggleNotificationById(id) {
    console.log(id);
  }
}
