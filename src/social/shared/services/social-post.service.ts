import { Injectable } from '@angular/core';

import { debounceTime } from 'rxjs/operators';

import { ApiBaseService, UserService } from '@wth/shared/services';
import { SoPost } from '@shared/shared/models';

/**
 * Created by phat on 18/11/2016.
 */

declare  let _: any;

@Injectable()
export class SoPostService {
  private postList: SoPost[] = [];

  constructor(private apiBaseService: ApiBaseService,
              private userService: UserService) {
  }

  getList(uuid: string = this.userService.getSyncProfile().uuid, type?: string) {
    const uuid2: string = uuid || this.userService.getSyncProfile().uuid;
    return this.getListSocialPosts(uuid2, type);
  }

  getNewPostsCount(uuid: string = this.userService.getSyncProfile().uuid) {
    return this.apiBaseService.post(`${this.apiBaseService.urls.zoneSoPosts}/get_new_social_posts_count`);
  }

  getSettings(uuid: string) {
    return this.apiBaseService.get(`${this.apiBaseService.urls.zoneSoPostSettings}/${uuid}`).pipe(
      debounceTime(250));
  }

  togglePostNotification(uuid: string) {
    return this.apiBaseService.post(`${this.apiBaseService.urls.zoneSoPosts}/toggle_post_notification`, {uuid: uuid});
  }

  private getListSocialPosts(uuid: any, type: string) {
    return this.apiBaseService.get(`${this.apiBaseService.urls.zoneSoUserPosts}/${uuid}`, {type: type});
  }
}
