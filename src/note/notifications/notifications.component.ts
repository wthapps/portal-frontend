import { Component, OnInit } from '@angular/core';
import { NotificationService } from '@wth/shared/services';


@Component({
  selector: 'notifications',
  templateUrl: 'notifications.component.html'
})

export class NotificationsComponent implements OnInit {
  constructor(
    public notificationService: NotificationService) {
  }

  ngOnInit() {
    this.notificationService.getLatestNotifications();
  }

  getMoreNotifications() {
    this.notificationService.getMoreNotifications();
  }

  isLoadingDone() {
    return this.notificationService.isLoadingDone();
  }

}
