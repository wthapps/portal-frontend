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
  readonly profileUrl: string = '/'+Constants.urls.profile;

  // Subscription loading
  loadSubscription : Subscription;

  constructor(private socialService: SocialService,
              private socialDataService : SocialDataService,
              public notificationService: NotificationService) {
  }

  ngOnInit() {
    // this.callNotifications();

    this.socialDataService.resetLoading();
    this.loadSubscription = this.socialDataService.itemObs$.subscribe( () => {
        this.getMoreNotifications();
      }
    );
  }

  ngOnDestroy() {
    this.loadSubscription.unsubscribe();
  }

  // callNotifications() {
  //   this.socialService.user.getNotifications().subscribe(
  //     (res: any) => {
  //       console.log(res.data);
  //       this.notifications = res.data;
  //       this.newNotifications = _.filter(this.notifications, {'seen_state': 'new'});
  //     }
  //   );
  // }

  getMoreNotifications() {
    // if (!this.loadingDone())
      this.notificationService.getMoreNotifications();
  }

  loadingDone() {
    return this.notificationService.loadingDone;  }

  notifClass(notif: any) {
    return 'col-xs-12 col-lg-6 ' + (!notif.is_read ? 'unread-notification' : '');
  }

  doAction(action: any, notif_id: string) {
    // let api: any = null;
    // switch (action.method) {
    //   case 'post':
    //     api = this.apiBaseService.post(action.link, action.params);
    //     break;
    //   case 'delete':
    //     api = this.apiBaseService.delete(action.link);
    //     break;
    // }
    //
    // api.subscribe(
    //   (res: any) => {
    //     this.callNotifications();
    //   }
    // );

    this.notificationService.doAction(action, notif_id);
  }
}
