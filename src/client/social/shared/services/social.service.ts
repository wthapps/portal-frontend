import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import 'rxjs/add/operator/debounceTime';

import { ApiBaseService } from '../../../core/shared/services/apibase.service';
import { UserService } from '../../../core/shared/services/user.service';
import { SoCommunityService } from './community.service';
import { Constants } from '../../../core/shared/config/constants';
import { User } from '../../../core/shared/models/user.model';
import { NotificationService } from '../../../core/shared/services/notification.service';
import { SoUserService } from './social-user.service';
import { SoPostService } from './social-post.service';
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
export class SocialService {
  constructor(public user: SoUserService,
              public post: SoPostService,
              public community: SoCommunityService,
              private apiBaseService: ApiBaseService
              ) {

  }

  unfavourite(favouriteUuid: string) {
    return this.apiBaseService.delete(`${soFavouritesUrl}/${favouriteUuid}`);
  }

  // Params format:
  // uuid: post / community / member uuid
  // type: post / community / member
  toggleFavourite(uuid: string, type: string) {

  }
}
