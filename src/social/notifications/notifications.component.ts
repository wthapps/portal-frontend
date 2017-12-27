import { Component, OnInit } from '@angular/core';
import { SocialService } from '../shared/services/social.service';
import { NotificationService } from '@wth/shared/services';
import { Constants } from '@wth/shared/constant';




@Component({

  selector: 'z-social-notifications',
  templateUrl: 'notifications.component.html'
})

export class ZSocialNotificationsComponent implements OnInit {
  readonly communitiesUrl: string = '/' + Constants.urls.communities;
  readonly profileUrl: string = '/' + Constants.urls.profile;

  constructor(private socialService: SocialService,
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
