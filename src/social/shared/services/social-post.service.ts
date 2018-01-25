import { Injectable } from '@angular/core';

import 'rxjs/add/operator/debounceTime';
import { ApiBaseService, UserService } from '@wth/shared/services';

/**
 * Created by phat on 18/11/2016.
 */

declare  let _: any;

@Injectable()
export class SoPostService {
  constructor(private apiBaseService: ApiBaseService,
              private userService: UserService) {
  }

  getList(uuid: string = this.userService.getSyncProfile().uuid, type?: string) {
    let uuid2: string = uuid || this.userService.getSyncProfile().uuid;
    return this.getListSocialPosts(uuid2, type);
  }

  getSettings(uuid: string) {
    return this.apiBaseService.get(`${this.apiBaseService.urls.zoneSoPostSettings}/${uuid}`).debounceTime(250);
  }

  togglePostNotification(uuid: string) {
    return this.apiBaseService.post(`${this.apiBaseService.urls.zoneSoPosts}/toggle_post_notification`, {uuid: uuid});
  }

  private getListSocialPosts(uuid: any, type: string) {
    return this.apiBaseService.get(`${this.apiBaseService.urls.zoneSoUserPosts}/${uuid}`, {type: type});
  }
}
