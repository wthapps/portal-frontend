import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { ApiBaseService } from '../../../core/shared/services/apibase.service';
import { UserService } from '../../../core/shared/services/user.service';
import { SoCommunityService } from './community.service';
import { Constants } from '../../../core/shared/config/constants';
import { User } from '../../../core/shared/models/user.model';
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
export class SoUserService {
  profile: User = null;


  constructor(private apiBaseService: ApiBaseService, private user: UserService) {
    this.profile = user.profile;
  }

  get(uuid: string = this.user.profile.uuid) {
    return this.apiBaseService.get(`${soUsersUrl}/${uuid}`);
  }

  // update(body: any) {
  //   return this.apiBaseService.put(`zone/social_network/users/${this.user.profile.uuid}`, body);
  // }

  update(body: any) {
    return this.apiBaseService.put(`${soUsersUrl}/update`, body).take(1);
  }

  reset_setting() {
    return this.apiBaseService.post(`${soUsersUrl}/reset_settings`);
  }

  addFriend(uuid: any) {
    return this.apiBaseService.post(`${soInvitationsUrl}`, {uuid: uuid}).take(1);
  }

  unfriend(uuid: any) {
    return this.apiBaseService.delete(`${soInvitationsUrl}/unfriend/${uuid}`).take(1);
  }

  unfollow(uuid: any) {
    return this.apiBaseService.post(`${soInvitationsUrl}/unfollow`, {uuid: uuid}).take(1);
  }

  follow(uuid: any) {
    return this.apiBaseService.post(`${soInvitationsUrl}/follow`, {uuid: uuid});
  }

  cancelFriendRequest(uuid: any) {
    return this.apiBaseService.delete(`${soInvitationsUrl}/${uuid}`);
  }

  getRelationShips(uuid?: string) {
    if (!uuid) {
      uuid = this.profile.uuid;
    }
    return this.apiBaseService.get(`${soInvitationsUrl}/${uuid}`);
  }

  getFavourites() {
    console.log('soFavouriteUrl: ' + soFavouritesUrl);
    return this.apiBaseService.get(`${soFavouritesUrl}`);
  }

  getFavourite(uuid: any, type: string) {
    return this.apiBaseService.get(`${soFavouritesUrl}/${uuid}`, {type: type});
  }

  toggleFavourites(uuid: any, type: string) {
    return this.apiBaseService.post(`${soFavouritesUrl}`, {uuid: uuid, type: type});
  }

  getNotifications() {
    return this.apiBaseService.get(`${soNotificationsUrl}`);
  }

  checkedNotifications() {
    return this.apiBaseService.post(`${soNotificationsUrl}/checked`);
  }

  reportUser(body: any) {
  // required params: report_entity_id, entity_type, reason, reporter_id, community_id
    _.merge(body, {entity_type : soReportEntity.user});
    return this.apiBaseService.post(`${soReportUrl}`, body);
  }

  reportCommuntity(body: any) {
    _.merge(body, {entity_type : soReportEntity.user});
    return this.apiBaseService.post(`${soReportUrl}`, body);
  }

  getReportList(community: any) {
    let body = {'community_id': community.id};
    return this.apiBaseService.get(`${soReportUrl}`, body);
  }

  // ================= Friend ======================
  getFriends(uuid: string = this.user.profile.uuid) {
    return this.apiBaseService.get(`${soFriendUrl}/${uuid}`);
  }
}

@Injectable()
export class SoPostService {
  constructor(private apiBaseService: ApiBaseService,
              private user: UserService,
              private  router: Router) {
  }

  getList(uuid: string = this.user.profile.uuid, type?: string) {
    // switch (this.router.url) {
    //   case '/home':
    //     return this.getListSocialPosts(uuid, type);
    // }
    return this.getListSocialPosts(uuid, type);
    // return this.getListOtherPosts(uuid, type);
  }

  getSettings(uuid: string) {
    return this.apiBaseService.get(`${this.apiBaseService.urls.zoneSoPostSettings}/${uuid}`);
  }

  private getListSocialPosts(uuid:any, type:string) {
    return this.apiBaseService.get(`${this.apiBaseService.urls.zoneSoUserPosts}/${uuid}`, {type: type});
  }
}




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


