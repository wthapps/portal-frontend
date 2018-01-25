import { Injectable } from '@angular/core';

import 'rxjs/add/operator/debounceTime';

import { SoCommunityService } from './community.service';
import { SoUserService } from './social-user.service';
import { SoPostService } from './social-post.service';
import { ApiBaseService } from '@wth/shared/services';
import { Constants } from '@wth/shared/constant';
/**
 * Created by phat on 18/11/2016.
 */

declare  let _: any;
export let soFavouritesUrl: string = Constants.urls.zoneSoFavourites;

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
