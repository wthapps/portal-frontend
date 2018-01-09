import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';



import { SocialService } from '../../services/social.service';
import { SocialFavoriteService } from '../../services/social-favorites.service';
import * as fromMember from '../../../shared/actions/member';
import { Constants } from '@wth/shared/constant';



@Component({

  selector: 'z-social-share-profile-member',
  templateUrl: 'member.component.html'
})
export class ZSocialShareProfileMemberComponent {
  @Input() data: any;
  @Output() outEvent: EventEmitter<any> = new EventEmitter();

  favourite: any; // toggle favourites status for members, communities

  friendStatus = Constants.friendStatus;
  tooltip: any = Constants.tooltip;

  constructor(private socialService: SocialService,
              private router: Router,
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

  viewProfile(item: any) {
    this.router.navigate(['/profile', item.uuid]);
  }

  // TODO:
  importToContacts(item: any) {
    console.log('inside importToContacts');
  }

  onCancelRequest(user: any) {
    console.log('onCancelRequest:', user);

    this.socialService.user.cancelFriendRequest(user.uuid).subscribe(
      (res: any) => {
        this.data.friend_status = 99;
        console.log('res:', res);
      },
    );
  }

  addFriend(user: any) {
    console.log(user);

    this.socialService.user.addFriend(user.uuid).toPromise().then(
      (res: any) => {
        user.friend_status = Constants.friendStatus.pending;
        this.outEvent.emit({action: fromMember.ACTIONS.ADD_FRIEND});
      }
    );
  }

  unfriend(user: any) {
    this.socialService.user.unfriend(user.uuid).toPromise().then(
      (res: any) => {
        // Currently not support unfriend status. May be updated later
        user.friend_status = Constants.friendStatus.stranger;
        this.outEvent.emit({action: fromMember.ACTIONS.UNFRIEND});
      },
    );
  }

  unfollow(friend: any) {
    this.socialService.user.unfollow(friend.uuid).toPromise().then(
      (res: any) => {
        friend.is_following = false;
        this.outEvent.emit({action: fromMember.ACTIONS.UNFOLLOW});
      },
    );
  }

  follow(friend: any) {
    this.socialService.user.follow(friend.uuid).toPromise().then(
      (res: any) => {
        // this.getUser();
        friend.is_following = true;
        this.outEvent.emit({action: fromMember.ACTIONS.FOLLOW});
      },
    );
  }
}
