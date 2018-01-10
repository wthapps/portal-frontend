import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import 'rxjs/add/operator/debounceTime';
import { ApiBaseService, UserService } from '@wth/shared/services';
import { Constants } from '@wth/shared/constant';

/**
 * Created by phat on 18/11/2016.
 */

declare  let _: any;
export let soCommunitiesUrl: string = Constants.urls.zoneSoCommunities;
export let soUsersUrl: string = Constants.urls.zoneSoUsers;
export let soInvitationsUrl: string = Constants.urls.zoneSoInvitations;
export let soFavouritesUrl: string = Constants.urls.zoneSoFavourites;
export let soNotificationsUrl: string = Constants.urls.zoneSoNotifications;
export let soReportUrl: string = Constants.urls.zoneSoReportList;
export let soReportEntity: any = Constants.soCommunityReportEntity;
export let soFriendUrl: any = Constants.urls.soFriendUrl;

@Injectable()
export class SoPostService {
  constructor(private apiBaseService: ApiBaseService,
              private userService: UserService,
              private  router: Router) {
  }

  getList(uuid: string = this.userService.getSyncProfile().uuid, type?: string) {
    return this.getListSocialPosts(uuid, type);
  }

  getSettings(uuid: string) {
    return this.apiBaseService.get(`${this.apiBaseService.urls.zoneSoPostSettings}/${uuid}`).debounceTime(250);
  }

  togglePostNotification(uuid: string) {
    return this.apiBaseService.post(`${this.apiBaseService.urls.zoneSoPosts}/toggle_post_notification`, {uuid: uuid});
  }

  private getListSocialPosts(uuid: any, type: string) {
    return this.apiBaseService.get(`${this.apiBaseService.urls.zoneSoUserPosts}/${uuid}`, {type: type});
  }
}
