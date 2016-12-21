import { Injectable } from '@angular/core';
import { ApiBaseService } from '../../../shared/services/apibase.service';
import { Router } from '@angular/router';
import { UserService } from '../../../shared/index';
/**
 * Created by phat on 18/11/2016.
 */
@Injectable()
export class SoUserService {
  constructor(private apiBaseService: ApiBaseService, private user: UserService) {
  }

  get(uuid: string = this.user.profile.uuid) {
    return this.apiBaseService.get(`zone/social_network/users/${uuid}`);
  }

  // update(body: any) {
  //   return this.apiBaseService.put(`zone/social_network/users/${this.user.profile.uuid}`, body);
  // }

  update(body: any) {
    return this.apiBaseService.put(`zone/social_network/users/update`, body);
  }

  reset_setting() {
    return this.apiBaseService.post(`zone/social_network/users/reset_settings`);
  }

  addFriend(uuid: any) {
    return this.apiBaseService.post(`zone/social_network/invitations`, {uuid: uuid});
  }

  unfriend(uuid: any) {
    return this.apiBaseService.delete(`zone/social_network/invitations/unfriend/${uuid}`);
  }

  unfollow(uuid: any) {
    return this.apiBaseService.post(`zone/social_network/invitations/unfollow`, {uuid: uuid});
  }

  follow(uuid: any) {
    return this.apiBaseService.post(`zone/social_network/invitations/follow`, {uuid: uuid});
  }

  cancelFriendRequest(uuid: any) {
    return this.apiBaseService.delete(`zone/social_network/invitations/${uuid}`);
  }

  getRelationShips(uuid?: string) {
    return this.apiBaseService.get(`zone/social_network/invitations/${uuid}`);
  }

  getFavourites() {
    return this.apiBaseService.get(`zone/social_network/favourites`);
  }

  getFavourite(uuid: any, type: string) {
    return this.apiBaseService.get(`zone/social_network/favourites/${uuid}`, {type: type});
  }

  addFavourites(uuid: any, type: string) {
    return this.apiBaseService.post(`zone/social_network/favourites`, {uuid: uuid, type: type});
  }

  getNotifications() {
    return this.apiBaseService.get(`zone/social_network/notifications`);
  }

  checkedNotifications() {
    return this.apiBaseService.post(`zone/social_network/notifications/checked`);
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
              public post: SoPostService) {

  }
}


