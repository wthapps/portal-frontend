import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NotificationService } from '@wth/shared/services';
import { Constants } from '@wth/shared/constant';
import { NotificationListComponent } from '@shared/shared/components/notification-list/notification-list.component';
import { ConnectionNotificationService } from '@wth/shared/services/connection-notification.service';

@Component({
  selector: 'common-notifications',
  templateUrl: 'notifications.component.html',
  styleUrls: ['notifications.component.scss'],
})

export class CommonNotificationsComponent implements OnInit {
  selectedNotifications: string[] = ['social', 'chat', 'note'];
  readonly profileUrl: string = '/' + Constants.urls.profile;
  @Input() type = 'update'; // update, connection

  @ViewChild('notifications') notificationListComponent: NotificationListComponent;

  constructor(public notificationService: NotificationService,
              public connectionService: ConnectionNotificationService,
              private route: ActivatedRoute) {
    route.queryParamMap.subscribe((queryParamMap: any) => {
      if (queryParamMap.get('type'))
        this.type = queryParamMap.get('type');
    });
  }

  ngOnInit() {
    this.notificationService.getLatestNotifications();
  }

  onSelectedTab(type: string) {
    this.type = type;
    if (this.type === 'connection')
      this.connectionService.getLatestNotifications();
    else
      this.notificationService.getLatestNotifications();
  }

  getMoreNotifications() {
    if (this.type === 'connection')
      this.connectionService.getMoreNotifications();
    else
      this.notificationService.getMoreNotifications();
  }


  onSettingModal() {
    this.notificationListComponent.settingModal.open();
  }

  save() {

  }
}
