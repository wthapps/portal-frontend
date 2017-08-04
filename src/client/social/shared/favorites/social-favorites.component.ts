import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/empty';

import { SocialService } from '../services/social.service';
import { Constants } from '../../../core/shared/config/constants';
import { ZSharedReportService } from '../../../core/shared/components/zone/report/report.service';

import { SocialFavoriteService } from '../services/social-favorites.service';

declare let _: any;

@Component({
  moduleId: module.id,
  selector: 'z-social-favorites',
  templateUrl: 'social-favorites.component.html'
})

export class ZSocialFavoritesComponent implements OnInit {
  tooltip: any = Constants.tooltip;

  favorites$: Observable<any> = Observable.empty();
  readonly profileUrl: string = '/' + Constants.urls.profile;
  readonly communitiesUrl: string = '/' + Constants.urls.communities;

  constructor(private socialService: SocialService,
              public favoriteService: SocialFavoriteService,
              private zoneReportService: ZSharedReportService) {
    // this.favorites$ = this.favoriteService.favoritesObs;
  }

  ngOnInit() {
    // this.getFavourites();
  }

  // getFavourites() {
  //   this.socialService.user.getFavourites().take(1).subscribe(
  //     // (res: any) => {
  //     //   this.favourites = res.data;
  //     // }
  //     this.favourites
  //   );
  // }

  unfavourite(favourite: any) {
    // this.socialService.unfavourite(favourite.uuid).take(1)
    //   .subscribe((response: any) => {
    //     _.remove(this.favourites.getValue(), (f: any) => f.uuid == favourite.uuid);
    // });

    this.favoriteService.unfavourite(favourite);
  }

  confirmLeaveCommunity(community: any) {
    this.favoriteService.confirmLeaveCommunity(community);
  }

  unfriend(friend: any) {
    // this.socialService.user.unfriend(friend.uuid).subscribe(
    //   (res: any) => {
    //     _.remove(this.favourites.getValue(), (f: any) => _.get(f, 'friend.uuid', '') == friend.uuid);
    //   },
    // );

    this.favoriteService.unfriend(friend);
  }

  // TODO:
  onReport(item: any) {
    this.zoneReportService.show(item);
    return false;
  }

  rearrange() {

  }
}
