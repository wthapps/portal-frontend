import { Component, OnInit, Input } from '@angular/core';
import { Constants } from '../../../../core/shared/config/constants';
import { SocialService } from '../../services/social.service';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-social-share-profile-member',
  templateUrl: 'member.component.html'
})
export class ZSocialShareProfileMemberComponent implements OnInit {
  @Input() data: any;

  favourite: any; // toggle favourites status for members, communities

  friendStatus = Constants.friendStatus;

  constructor(private socialService: SocialService) {
  }

  ngOnInit() {
  }

  toggleFavourite(item: any, group: string) {
    this.socialService.user.toggleFavourites(item.uuid, group).subscribe(
      (res: any) => {
        if (!_.isEmpty(this.favourite)) {
          this.favourite = undefined;
        } else {
          this.favourite = res.data;
        }
      }
    );
  }

  /*
   Params format:
   item: community / member object
   group: community / members
   */
  getFavourite(item: any, group: string) {
    this.socialService.user.getFavourite(item.uuid, group).subscribe(
      (res: any) => {
        this.favourite = res.data;
      }
    );
  }

  toggleFollow(item: any) {

  }


  // TODO:
  importToContacts(item: any) {

  }

  addFriend(user: any) {

    this.socialService.user.addFriend(user.uuid).subscribe(
      (res: any) => {
        user.friend_status = Constants.friendStatus.pending;
      }
    );
  }

  unfriend(user: any) {
    this.socialService.user.unfriend(user.uuid).subscribe(
      (res: any) => {
        // Currently not support unfriend status. May be updated later
        user.friend_status = Constants.friendStatus.stranger;
      },
    );
  }

  unfollow(friend: any) {
    this.socialService.user.unfollow(friend.uuid).subscribe(
      (res: any) => {
        friend.is_following = false;
      },
    );
  }

  follow(friend: any) {
    this.socialService.user.follow(friend.uuid).subscribe(
      (res: any) => {
        // this.getUser();
        friend.is_following = true;
      },
    );
  }
}
