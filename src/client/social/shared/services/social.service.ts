import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { ApiBaseService } from '../../../core/shared/services/apibase.service';
import { UserService } from '../../../core/shared/services/user.service';
import SocialConstants = require("../../shared/social.constants");
import {SoCommunityService} from "./community.service";
import {Constants} from "../../../core/shared/config/constants";
/**
 * Created by phat on 18/11/2016.
 */
@Injectable()
export class SoUserService {
  soCommunitiesUrl: string = Constants.urls.zoneSoCommunities;
  soUsersUrl: string = Constants.urls.zoneSoUsers;
  soInvitationsUrl: string = Constants.urls.zoneSoInvitations;
  soFavouritesUrl: string = Constants.urls.zoneSoFavourites;
  soNotificationsUrl: string = Constants.urls.zoneSoNotifications;


  constructor(private apiBaseService: ApiBaseService, private user: UserService) {

  }

  ngOnInit() {
  }

  get(uuid: string = this.user.profile.uuid) {
    return this.apiBaseService.get(`${this.soUsersUrl}/${uuid}`);
  }

  // update(body: any) {
  //   return this.apiBaseService.put(`zone/social_network/users/${this.user.profile.uuid}`, body);
  // }

  update(body: any) {
    return this.apiBaseService.put(`${this.soUsersUrl}/update`, body);
  }

  reset_setting() {
    return this.apiBaseService.post(`${this.soUsersUrl}/reset_settings`);
  }

  addFriend(uuid: any) {
    return this.apiBaseService.post(`${this.soInvitationsUrl}`, {uuid: uuid});
  }

  unfriend(uuid: any) {
    return this.apiBaseService.delete(`${this.soInvitationsUrl}/unfriend/${uuid}`);
  }

  unfollow(uuid: any) {
    return this.apiBaseService.post(`${this.soInvitationsUrl}/unfollow`, {uuid: uuid});
  }

  follow(uuid: any) {
    return this.apiBaseService.post(`${this.soInvitationsUrl}/follow`, {uuid: uuid});
  }

  cancelFriendRequest(uuid: any) {
    return this.apiBaseService.delete(`${this.soInvitationsUrl}/${uuid}`);
  }

  getRelationShips(uuid?: string) {
    return this.apiBaseService.get(`${this.soInvitationsUrl}/${uuid}`);
  }

  getFavourites() {
    console.log('soFavouriteUrl: ' + this.soFavouritesUrl);
    return this.apiBaseService.get(`${this.soFavouritesUrl}`);
  }

  getFavourite(uuid: any, type: string) {
    return this.apiBaseService.get(`${this.soFavouritesUrl}/${uuid}`, {type: type});
  }

  addFavourites(uuid: any, type: string) {
    return this.apiBaseService.post(`${this.soFavouritesUrl}`, {uuid: uuid, type: type});
  }

  getNotifications() {
    return this.apiBaseService.get(`${this.soNotificationsUrl}`);
  }

  checkedNotifications() {
    return this.apiBaseService.post(`${this.soNotificationsUrl}/checked`);
  }
}

@Injectable()
export class SoPostService {
  constructor(private apiBaseService: ApiBaseService,
              private user: UserService,
              private  router: Router) {
  }

  getList(uuid: string = this.user.profile.uuid, type?: string) {
    switch (this.router.url) {
      case '/zone/social/home':
        return this.getListSocialPosts();
    }
    return this.getListOtherPosts(uuid, type);
  }

  getSettings(uuid: string) {
    return this.apiBaseService.get(`${this.apiBaseService.urls.zoneSoPostSettings}/${uuid}`);
  }

  private getListSocialPosts() {
    return this.apiBaseService.get(this.apiBaseService.urls.zoneSoPosts);
  }

  private getListOtherPosts(uuid: string, type: string) {
    return this.apiBaseService.get(`${this.apiBaseService.urls.zoneSoUserPosts}/${uuid}/`, {type: type});
  }
}




@Injectable()
export class SocialService {
  constructor(public user: SoUserService,
              public post: SoPostService,
              public community: SoCommunityService
              ) {

  }
}


