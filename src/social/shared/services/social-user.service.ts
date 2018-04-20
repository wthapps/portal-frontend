import { Injectable } from '@angular/core';

import { ApiBaseService } from '@wth/shared/services';
import { UserService } from '@shared/services/user.service';
import { NotificationService } from '@shared/services/notification.service';
import { Constants } from '@wth/shared/constant';
import { User } from '@wth/shared/shared/models';

/**
 * Created by phat on 18/11/2016.
 */

declare  let _: any;
export let soUsersUrl: string = Constants.urls.zoneSoUsers;
export let soInvitationsUrl: string = Constants.urls.zoneSoInvitations;
export let soFavouritesUrl: string = Constants.urls.zoneSoFavourites;
export let soFriendUrl: any = Constants.urls.soFriendUrl;

@Injectable()
export class SoUserService {
  profile: User = null;

  constructor(private apiBaseService: ApiBaseService, private userService: UserService, private notificationService: NotificationService) {
    this.profile = this.userService.getSyncProfile();
  }

  get(uuid: string = this.userService.getSyncProfile().uuid) {
    return this.apiBaseService.get(`${soUsersUrl}/${uuid}`);
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

  acceptFriendRequest(uuid: any) {
    return this.apiBaseService.post(`${soInvitationsUrl}/accept`, {uuid, show_status: true});
  }

  declineFriendRequest(uuid: any) {
    return this.apiBaseService.post(`${soInvitationsUrl}/reject`, {uuid, show_status: true});
  }

  getRelationShips(uuid?: string) {
    if (!uuid) {
      uuid = this.profile.uuid;
    }
    return this.apiBaseService.get(`${soInvitationsUrl}/${uuid}`);
  }

  getFavourites() {
    return this.apiBaseService.get(`${soFavouritesUrl}`);
  }

  getFavourite(uuid: any, type: string) {
    return this.apiBaseService.get(`${soFavouritesUrl}/${uuid}`, {type: type}).take(1);
  }

  toggleFavourites(uuid: any, type: string) {
    return this.apiBaseService.post(`${soFavouritesUrl}`, {uuid: uuid, type: type});
  }

  // ================= Friend ======================
  getFriends(uuid: string = this.userService.getSyncProfile().uuid) {
    return this.apiBaseService.get(`${soFriendUrl}/${uuid}`);
  }

  // ================= Follower ======================
  getFollowerList(uuid: string = this.userService.getSyncProfile().uuid ) {
    return this.apiBaseService.get(`${soUsersUrl}/followers/${uuid}`);
  }

  // ================= Following ======================
  getFollowingList(uuid: string = this.userService.getSyncProfile().uuid ) {
    return this.apiBaseService.get(`${soUsersUrl}/followings/${uuid}`);
  }

  getReceivedRequests(uuid: string = this.userService.getSyncProfile().uuid) {
    return this.apiBaseService.post(`${soUsersUrl}/get_received_invitations`);
  }

  getPendingRequests(uuid: string = this.userService.getSyncProfile().uuid) {
    return this.apiBaseService.post(`${soUsersUrl}/get_pending_invitations`);
  }
}
