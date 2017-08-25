import { Component, Input } from '@angular/core';

import 'rxjs/add/operator/toPromise';

import { Constants } from '../../../../core/shared/config/constants';
import { SocialService } from '../../services/social.service';
import { SocialFavoriteService } from '../../services/social-favorites.service';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-social-share-profile-member',
  templateUrl: 'member.component.html'
})
export class ZSocialShareProfileMemberComponent {
  @Input() data: any;

  favourite: any; // toggle favourites status for members, communities

  friendStatus = Constants.friendStatus;
  tooltip: any = Constants.tooltip;

  constructor(private socialService: SocialService,
              private favoriteService: SocialFavoriteService) {
  }

  toggleFavourite(item: any, group: string) {
    this.favoriteService.addFavourite(item.uuid, group)
      .then((res: any) => {
        if (!_.isEmpty(this.favourite)) {
          this.favourite = undefined;
        } else {
          this.favourite = res.data;
        }
      });
  }

  /*
   Params format:
   item: community / member object
   group: community / members
   */
  getFavourite(item: any, group: string) {
    this.socialService.user.getFavourite(item.uuid, group).toPromise().then(
      (res: any) => {
        this.favourite = res.data;
      }
    );
  }

  // TODO:
  importToContacts(item: any) {
    console.log('inside importToContacts');
  }

  addFriend(user: any) {

    this.socialService.user.addFriend(user.uuid).toPromise().then(
      (res: any) => {
        user.friend_status = Constants.friendStatus.pending;
      }
    );
  }

  unfriend(user: any) {
    this.socialService.user.unfriend(user.uuid).toPromise().then(
      (res: any) => {
        // Currently not support unfriend status. May be updated later
        user.friend_status = Constants.friendStatus.stranger;
      },
    );
  }

  unfollow(friend: any) {
    this.socialService.user.unfollow(friend.uuid).toPromise().then(
      (res: any) => {
        friend.is_following = false;
      },
    );
  }

  follow(friend: any) {
    this.socialService.user.follow(friend.uuid).toPromise().then(
      (res: any) => {
        // this.getUser();
        friend.is_following = true;
      },
    );
  }
}
