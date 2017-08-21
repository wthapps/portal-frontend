import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


import { ApiBaseService } from '../../../core/shared/services/apibase.service';
import { SocialService } from '../../shared/services/social.service';
import { UserService } from '../../../core/shared/services/user.service';
import { ToastsService } from '../../../core/shared/components/toast/toast-message.service';
import { ZSharedReportService } from '../../../core/shared/components/zone/report/report.service';

import { Constants } from '../../../core/shared/config/constants';
import { SocialFavoriteService } from '../../shared/services/social-favorites.service';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-social-profile-cover',
  templateUrl: 'cover.component.html'
})

export class ZSocialProfileCoverComponent implements OnInit, OnChanges {

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
    FRIEND: 2
  };

  constructor(private socialService: SocialService,
              public userService: UserService,
              private zoneReportService: ZSharedReportService,
              private favoriteService: SocialFavoriteService,
              private toastsService: ToastsService,
              private route: ActivatedRoute) {
  }

  ngOnChanges(data: any) {
    if (this.data) {

      this.userInfo = this.data;

      // Only user can change his own profile / cover image
      if (this.userService.profile.uuid == this.userInfo.uuid) {
        this.userInfo.canEdit = true;
        // this.userInfo = Object.assign({}, this.userInfo, {canEdit: true});
      }
    }
    if (this.userInfo && this.userService.profile.uuid != this.userInfo.uuid) {
      this.showFriends = this.userInfo.settings.show_friends.value;
    }
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      console.debug('cover route params: ', params);
      this.uuid = params['id'] ? params['id'] : this.userService.getProfileUuid();

      if (this.userService.profile.uuid != params['id']) {
        this.socialService.user.getRelationShips(params['id'])
          .toPromise()
          .then((res: any) => {
              this.relationships = res.data
            },
          );
      } else {
        this.relationships = undefined;
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
              Object.assign(this.userService.profile, {'profile_image': result.data.profile_image});
              this.userService.updateProfile(this.userService.profile);
            }
          }
          else if (_.has(event.body, 'cover_image')) {
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
