import { Component, OnInit, OnDestroy } from '@angular/core';
import { SocialService } from '../shared/services/social.service';
import { Constants } from '../../core/shared/config/constants';
import { NotificationService } from '../../core/shared/services/notification.service';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-social-notifications',
  templateUrl: 'notifications.component.html'
})

export class ZSocialNotificationsComponent implements OnInit, OnDestroy {
  readonly communitiesUrl: string = '/' + Constants.urls.communities;
  readonly profileUrl: string = '/' + Constants.urls.profile;

  constructor(private socialService: SocialService,
              public notificationService: NotificationService) {
  }

  ngOnInit() {
    this.notificationService.getLatestNotifications();
  }

  ngOnDestroy() {
  }

  getMoreNotifications() {
    this.notificationService.getMoreNotifications();
  }

  isLoadingDone() {
    return this.notificationService.isLoadingDone();
  }

}
