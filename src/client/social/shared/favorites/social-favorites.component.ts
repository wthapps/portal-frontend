import { Component, OnInit } from '@angular/core';

import { SocialService } from '../services/social.service';
import { Constants } from '../../../core/shared/config/constants';
import { ZoneReportService } from '../form/report/report.service';

declare let _ : any;

@Component({
  moduleId: module.id,
  selector: 'z-social-favorites',
  templateUrl: 'social-favorites.component.html'
})

export class ZSocialFavoritesComponent implements OnInit {

  favourites: any = [];
  readonly profileUrl: string = '/' + Constants.urls.profile;
  readonly communitiesUrl: string = '/' + Constants.urls.communities;

  constructor(private socialService: SocialService,
              private zoneReportService: ZoneReportService
  ) {
  }

  ngOnInit() {
    this.getFavourites();
  }

  getFavourites() {
    this.socialService.user.getFavourites().take(1).subscribe(
      (res: any) => {
        this.favourites = res.data;
      }
    );
  }

  unfavourite(favourite: any) {
    this.socialService.unfavourite(favourite.uuid).take(1)
      .subscribe((response: any) => {
        _.remove(this.favourites, (f: any) => f.uuid == favourite.uuid);
    })
  }

  leaveCommunity(community: any) {
    this.socialService.community.leaveCommunity(community.uuid)
      .subscribe((response: any) => {
          _.remove(this.favourites, (f: any) => _.get(f, 'community.uuid', '') == community.uuid);
        }
      );
  }

  unfriend(friend: any) {
    this.socialService.user.unfriend(friend.uuid).subscribe(
      (res: any) => {
        _.remove(this.favourites, (f: any) => _.get(f, 'friend.uuid', '') == friend.uuid);
      },
    );
  }

  // TODO:
  onReport(item: any) {
    this.zoneReportService.show(item);
    return false;
  }

  rearrange() {

  }
}
