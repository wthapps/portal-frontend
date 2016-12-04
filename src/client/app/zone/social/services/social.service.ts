import { Injectable } from '@angular/core';
import { ApiBaseServiceV2 } from '../../../shared/services/apibase.service.v2';
import { Params, Router } from '@angular/router';
import { UserService } from '../../../shared/index';
/**
 * Created by phat on 18/11/2016.
 */
@Injectable()
export class SoUserService {
  constructor(private apiBaseServiceV2: ApiBaseServiceV2, private user: UserService) {
  }

  get(uuid?: string) {
    if (uuid) {
      return this.getOther(uuid)
    }
    return this.apiBaseServiceV2.get(`zone/social_network/users/${this.user.profile.uuid}`);
  }

  update(body:any) {
    return this.apiBaseServiceV2.put(`zone/social_network/users/${this.user.profile.uuid}`, body);
  }

  reset_setting() {
    return this.apiBaseServiceV2.post(`zone/social_network/users/reset_settings`);
  }

  addFriend(uuid:any) {
    return this.apiBaseServiceV2.post(`zone/social_network/invitations`, {uuid: uuid});
  }

  unfriend(uuid:any) {
    return this.apiBaseServiceV2.delete(`zone/social_network/invitations/unfriend/${uuid}`);
  }

  unfollow(uuid:any) {
    return this.apiBaseServiceV2.post(`zone/social_network/invitations/unfollow`, {uuid: uuid});
  }

  follow(uuid:any) {
    return this.apiBaseServiceV2.post(`zone/social_network/invitations/follow`, {uuid: uuid});
  }

  cancelFriendRequest(uuid:any) {
    return this.apiBaseServiceV2.delete(`zone/social_network/invitations/${uuid}`);
  }

  getRelationShips(uuid?: string) {
    return this.apiBaseServiceV2.get(`zone/social_network/invitations/${uuid}`);
  }

  getFavorites() {
    console.log('get favorites');
    return this.apiBaseServiceV2.get(`zone/social_network/favorites`);
  }

  private getOther(uuid) {
    return this.apiBaseServiceV2.get(`zone/social_network/users/${uuid}`);
  }
}

@Injectable()
export class SoPostService {
  constructor(private apiBaseServiceV2: ApiBaseServiceV2,
              private	router:	Router) {
  }
  getList(uuid?:string) {
    if (uuid) {
      return this.getListOtherPosts(uuid)
    }
    switch (this.router.url) {
      case '/zone/social/home':
        return this.getListSocialPosts();
    }
  }

  getSettings(uuid:string) {
    return this.apiBaseServiceV2.get(`${this.apiBaseServiceV2.urls.zoneSoPostSettings}/${uuid}`);
  }

  private getListSocialPosts() {
    return this.apiBaseServiceV2.get(this.apiBaseServiceV2.urls.zoneSoPosts);
  }

  private getListOtherPosts(uuid) {
    return this.apiBaseServiceV2.get(`${this.apiBaseServiceV2.urls.zoneSoUserPosts}/${uuid}`);
  }
}


@Injectable()
export class SocialService {
  constructor(public user: SoUserService,
              public post: SoPostService) {

  }
}


