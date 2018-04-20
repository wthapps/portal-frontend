import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { empty } from 'rxjs/observable/empty';

import { SocialService } from '../services/social.service';

import { SocialFavoriteService } from '../services/social-favorites.service';
import { ZSharedReportService } from '@wth/shared/shared/components/zone/report/report.service';
import { Constants } from '@wth/shared/constant';

declare let _: any;

@Component({
  selector: 'z-social-favorites',
  templateUrl: 'social-favorites.component.html'
})

export class ZSocialFavoritesComponent {
  tooltip: any = Constants.tooltip;

  favorites$: Observable<any> = empty();
  readonly profileUrl: string = '/' + Constants.urls.profile;
  readonly communitiesUrl: string = '/' + Constants.urls.communities;

  constructor(private socialService: SocialService,
              public favoriteService: SocialFavoriteService,
              private zoneReportService: ZSharedReportService) {
    // this.favorites$ = this.favoriteService.favoritesObs;
  }


  unfavourite(favourite: any) {
    this.favoriteService.unfavourite(favourite);
  }

  confirmLeaveCommunity(community: any) {
    this.favoriteService.confirmLeaveCommunity(community);
  }

  unfriend(friend: any) {
    this.favoriteService.unfriend(friend);
  }

  onReport(item: any) {
    this.zoneReportService.show(item);
    return false;
  }

  rearrange() {

  }
}
