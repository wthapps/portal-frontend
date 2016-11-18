import { Injectable } from '@angular/core';
import { ApiBaseServiceV2 } from '../../../shared/services/apibase.service.v2';
import { Params, Router } from '@angular/router';
/**
 * Created by phat on 18/11/2016.
 */
@Injectable()
export class SoUserService {
  constructor(private apiBaseServiceV2: ApiBaseServiceV2) {
  }
  get(uuid?:string) {
    if (uuid) {
      return this.getOther(uuid)
    }
    return this.apiBaseServiceV2.get('zone/social_network/users/mine');
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
      case '/zone/social':
        return this.getListSocialPosts();
      case '/zone/social/profile':
        return this.getListMyPosts();
      default:
        return this.getListMyPosts();
    }
  }

  private getListSocialPosts() {
    return this.apiBaseServiceV2.get(this.apiBaseServiceV2.urls.zoneSoPosts);
  }

  private getListMyPosts() {
    return this.apiBaseServiceV2.get(this.apiBaseServiceV2.urls.zoneSoMyPosts);
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


