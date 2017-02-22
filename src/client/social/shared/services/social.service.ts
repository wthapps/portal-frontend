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

@Injectable()
export class SoUserService {
  readonly soCommunitiesUrl: string = Constants.urls.zoneSoCommunities;
  readonly soUsersUrl: string = Constants.urls.zoneSoUsers;
  readonly soInvitationsUrl: string = Constants.urls.zoneSoInvitations;
  readonly soFavouritesUrl: string = Constants.urls.zoneSoFavourites;
  readonly soNotificationsUrl: string = Constants.urls.zoneSoNotifications;
  readonly soReportUrl: string = Constants.urls.zoneSoReportList;
  readonly soReportEntity: any = Constants.soCommunityReportEntity;
  profile: User = null;


  constructor(private apiBaseService: ApiBaseService, private user: UserService) {
    this.profile = user.profile;
  }

  ngOnInit() {
    return ;
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

  reportUser(body: any) {
  // required params: report_entity_id, entity_type, reason, reporter_id, community_id
    _.merge(body, {entity_type : this.soReportEntity.user});
    return this.apiBaseService.post(`${this.soReportUrl}`, body);
  }

  reportCommuntity(body: any) {
    _.merge(body, {entity_type : this.soReportEntity.user});
    return this.apiBaseService.post(`${this.soReportUrl}`, body);
  }

  getReportList(community: any) {
    let body = {'community_id': community.id};
    return this.apiBaseService.get(`${this.soReportUrl}`, body);
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


