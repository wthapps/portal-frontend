import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NotificationService } from '@wth/shared/services';
import { Constants } from '@wth/shared/constant';
import { NotificationListComponent } from '@shared/shared/components/notification-list/notification-list.component';


@Component({
  selector: 'z-social-notifications',
  templateUrl: 'notifications.component.html',
  styleUrls: ['notifications.component.scss']
})

export class ZSocialNotificationsComponent implements OnInit {
  readonly communitiesUrl: string = '/' + Constants.urls.communities;
  readonly profileUrl: string = '/' + Constants.urls.profile;

  type: string = 'update'; // update, connection

  @ViewChild('notifications') notificationListComponent: NotificationListComponent;

  constructor(public notificationService: NotificationService) {
  }

  ngOnInit() {
    this.notificationService.getLatestNotifications();
  }

  onSelectedTab(type: string) {
    this.type = type;
    console.log(this.notificationListComponent);
  }

  getMoreNotifications() {
    this.notificationService.getMoreNotifications();
  }

  isLoadingDone() {
    return this.notificationService.isLoadingDone();
  }

}
