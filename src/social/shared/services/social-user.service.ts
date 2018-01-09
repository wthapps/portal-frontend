import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import 'rxjs/add/operator/debounceTime';

import { ApiBaseService } from '@wth/shared/services';
import { UserService } from '@shared/services/user.service';
import { NotificationService } from '@shared/services/notification.service';
import { Constants } from '@wth/shared/constant';
import { User } from '@wth/shared/shared/models';

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

  // Cached friends data of current user
  private ownFriendInfo: any =  {
    totalFriends: undefined,
    totalFollowers: undefined,
    totalFollowings: undefined,
    totalBlacklist: undefined
  };


  constructor(private apiBaseService: ApiBaseService, private user: UserService, private notificationService: NotificationService) {
    this.profile = user.profile;
  }

  get(uuid: string = this.user.profile.uuid) {
    return this.apiBaseService.get(`${soUsersUrl}/${uuid}`);
  }

  getOwnFriendInfo(): Promise<any> {
    console.debug('ownFriendInfo: ', this.ownFriendInfo);
    if(this.ownFriendInfo.totalFriends && this.ownFriendInfo.totalFollowers && this.ownFriendInfo.totalFollowings && this.ownFriendInfo.totalBlacklists)
      return Promise.resolve(this.ownFriendInfo);

    return this.get().toPromise().then(
      (res: any) => {
        _.set(this.ownFriendInfo, 'totalFriends', res.data.total_friends);
        _.set(this.ownFriendInfo, 'totalFollowers', res.data.total_followers);
        _.set(this.ownFriendInfo, 'totalFollowings', res.data.total_followings);
        _.set(this.ownFriendInfo, 'totalBlacklist', res.data.total_blacklists);
        return this.ownFriendInfo;
      });
  }

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
    return this.apiBaseService.get(`${soFavouritesUrl}/${uuid}`, {type: type}).take(1);
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

  // ================= Follower ======================
  getFollowerList(uuid: string = this.user.profile.uuid ) {
    return this.apiBaseService.get(`${soUsersUrl}/followers/${uuid}`);
  }

  // ================= Following ======================
  getFollowingList(uuid: string = this.user.profile.uuid ) {
    return this.apiBaseService.get(`${soUsersUrl}/followings/${uuid}`);
  }
}
