import { Component, OnInit, OnDestroy } from '@angular/core';
import { SocialService } from '../shared/services/social.service';
import { ApiBaseService } from '../../core/shared/services/apibase.service';
import { Constants } from '../../core/shared/config/constants';
import { NotificationService } from '../../core/shared/services/notification.service';
import { SocialDataService } from '../shared/services/social-data.service';
import { Subscription } from 'rxjs';
// import { SocialService } from '../services/social.service';
// import { ApiBaseService } from '../../../shared/services/apibase.service';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-social-notifications',
  templateUrl: 'notifications.component.html'
})

export class ZSocialNotificationsComponent implements OnInit, OnDestroy {
  // notifications: any = [];
  // newNotifications: any = [];
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

  notifClass(notif: any) {
    return 'col-xs-12 col-lg-6 ' + (!notif.is_read ? 'unread-notification' : '');
  }

}
