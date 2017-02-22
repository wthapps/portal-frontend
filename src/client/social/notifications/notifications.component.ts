import { Component, OnInit } from '@angular/core';
import { SocialService } from '../shared/services/social.service';
import { ApiBaseService } from '../../core/shared/services/apibase.service';
import { Constants } from '../../core/shared/config/constants';
import { NotificationService } from '../../core/shared/channels/notification.service';
// import { SocialService } from '../services/social.service';
// import { ApiBaseService } from '../../../shared/services/apibase.service';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-social-notifications',
  templateUrl: 'notifications.component.html'
})

export class ZSocialNotificationsComponent implements OnInit {
  notifications: any = [];
  newNotifications: any = [];
  readonly communitiesUrl: string = '/' + Constants.urls.communities;
  readonly profileUrl: string = '/'+Constants.urls.profile;


  constructor(private socialService: SocialService,
              private notificationService: NotificationService,
              private apiBaseService: ApiBaseService) {
  }

  ngOnInit() {
    this.callNotifications();
  }

  callNotifications() {
    this.socialService.user.getNotifications().subscribe(
      (res: any) => {
        console.log(res.data);
        this.notifications = res.data;
        this.newNotifications = _.filter(this.notifications, {'seen_state': 'new'});
      }
    );
  }

  doAction(action: any) {
    let api: any = null;
    switch (action.method) {
      case 'post':
        api = this.apiBaseService.post(action.link, action.params);
        break;
      case 'delete':
        api = this.apiBaseService.delete(action.link);
        break;
    }

    api.subscribe(
      (res: any) => {
        this.callNotifications();
      }
    );
  }
}
