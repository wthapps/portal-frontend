import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SocialService } from '../../shared/services/social.service';

import { SocialFavoriteService } from '../../shared/services/social-favorites.service';
import { ZSocialProfileDataService } from '../profile-data.service';
import { UserService } from '@wth/shared/services';
import { ZSharedReportService } from '@wth/shared/shared/components/zone/report/report.service';
import { ToastsService } from '@wth/shared/shared/components/toast/toast-message.service';
import { Constants } from '@wth/shared/constant';



@Component({
  selector: 'z-social-profile-cover',
  templateUrl: 'cover.component.html'
})

export class ZSocialProfileCoverComponent implements OnInit {

  @Input() data: any;

  errorMessage: string = '';
  item: any = [];
  uuid: string = '';
  userInfo: any;

  relationships: any;
  showFriends: boolean = true;

  favourite: any; // toggle favourites status for members, communities

  tooltip: any = Constants.tooltip;
  readonly FRIEND_STATUS: any = {
    STRANGER: 0,
    REQUEST_SENT: 1,
    FRIEND: 2,
    BE_REJECTED: 3,
    BE_REQUESTED: 88,
  };

  constructor(private socialService: SocialService,
              public userService: UserService,
              private zoneReportService: ZSharedReportService,
              private favoriteService: SocialFavoriteService,
              private toastsService: ToastsService,
              private profileDataService: ZSocialProfileDataService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {

    this.profileDataService.profileData$
      .subscribe((res: any) => { console.debug('profileData in cover: ', res);
      this.userInfo = res.userInfo;
      this.uuid = res.userInfo.uuid;
      this.relationships = res.relationships;

      if (this.userInfo && this.userService.getSyncProfile().uuid != this.userInfo.uuid) {
        this.showFriends = _.get(this.userInfo, 'settings.show_friends.value', false);
      }
    });
  }

  checkFavorite() {
    // Check favourite status
    _.each(this.favoriteService.favorites, (f: any) => { if( f.friend && f.friend.uuid === this.uuid)
      this.favourite = f.friend;
    });
    console.debug('this.favoriteService.favorites: ', this.favoriteService.favorites, this.favourite);
  }

  follow(uuid: string) {
    this.socialService.user.follow(uuid).toPromise()
      .then((res: any) => this.relationships.follow = true);
  }

  unfollow(uuid: string) {
    this.socialService.user.unfollow(uuid).toPromise()
      .then((res: any) => this.relationships.follow = false);
  }

  onCoverAction(event: any) {
    if (event.action == 'updateItem') {
      // Update profile via API call
      this.socialService.user.update(event.body)
        .subscribe((result: any) => {
          console.log('update profile sucess: ', result);
          let toastMsg:string = '';
          if (_.has(event.body, 'profile_image')) {
            toastMsg = 'You have updated profile image successfully';
            // Update user profile
            if (this.socialService.user.profile.uuid === _.get(result, 'data.uuid')) {
              Object.assign(this.socialService.user.profile, {'profile_image': result.data.profile_image});
              Object.assign(this.userService.getSyncProfile(), {'profile_image': result.data.profile_image});
              this.userService.updateProfile(this.userService.getSyncProfile());
            }
          } else if (_.has(event.body, 'cover_image')) {
                toastMsg = 'You have updated cover image of this community successfully';
          } else {
            toastMsg = result.message;
          }

          this.toastsService.success(toastMsg);
        });
    }
  }

  onUpdated(item: any) {
    if (item) {
      this.userInfo = item;
    }
  }

  onAddfriend() {

    this.socialService.user.addFriend(this.userInfo.uuid).subscribe(
      (res: any) => {
        this.relationships = res.data;
      }
    );
  }

  onUnfriend() {
    this.socialService.user.unfriend(this.userInfo.uuid).subscribe(
      (res: any) => {
        this.relationships = res.data;
      },
    );
  }

  onCancelRequest() {
    this.socialService.user.cancelFriendRequest(this.userInfo.uuid).subscribe(
      (res: any) => {
        this.relationships = res.data;
      },
    );
  }

  onAcceptRequest() {
    this.socialService.user.acceptFriendRequest(this.userInfo.uuid).subscribe(
      (res: any) => {
        this.relationships = res.data;
      },
    );
  }

  onDecline() {
    this.socialService.user.declineFriendRequest(this.userInfo.uuid).subscribe(
      (res: any) => {
        this.relationships = res.data;
      },
    );
  }


  onReport() {
    this.zoneReportService.member(this.userInfo.uuid);
    return false;
  }

  toggleFavourite(item: any, group: string) {
    // this.socialService.user.toggleFavourites(item.uuid, group).toPromise().then(
    this.favoriteService.addFavourite(item.uuid, group)
      .then(
      (res: any) => {
        console.log(res);
        if (!_.isEmpty(this.favourite)) {
          this.favourite = undefined;
        } else {
          this.favourite = res.data;
        }
      }
    );
  }

  // TODO:
  importToContacts(item: any) {
    console.log(item);
  }
}
