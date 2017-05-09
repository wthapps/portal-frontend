import { Component, OnInit } from '@angular/core';

import { SocialService } from '../services/social.service';
import { Constants } from '../../../core/shared/config/constants';
import { ZoneReportService } from '../form/report/report.service';
import { Router } from '@angular/router';
import { UserService } from '../../../core/shared/services/user.service';
import { ConfirmationService } from 'primeng/components/common/api';

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
              private router: Router,
              private userService: UserService,
              private confirmationService: ConfirmationService,
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

  onLeave(community: any) {
    // Check if there are other admins beside current user in community
    // If not, he must pick another one before leaving
    let enoughAdmins = community.admin_count > 1 ? true : false;
    let pickAnotherAdmin = _.indexOf(community.admins, (a: any) => a.uuid == this.userService.profile.uuid) > -1  && !enoughAdmins;

    this.confirmationService.confirm({
      message: pickAnotherAdmin ?
        `Hi there, you need to pick another admin for the community ${community.name} before leaving.` :
        `Are you sure to leave the community ${community.name}?`,
      header: 'Leave Community',
      accept: () => {
        if (pickAnotherAdmin) {
          // Navigate to member tab
          this.router.navigate([this.communitiesUrl, community.uuid], { queryParams: {tab: 'members', skipLocationChange: true }});
        } else {
          this.leaveCommunity(community);
        }
      }
    });

    return false;
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
