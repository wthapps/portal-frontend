import { Component, OnInit } from '@angular/core';
import { SoUser } from '../../core/shared/models/social_network/so-user.model';
import { SocialService } from '../shared/services/social.service';
import { ApiBaseService } from '../../core/shared/services/apibase.service';
import { NotificationService } from '../../core/shared/services/notification.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingService } from '../../core/partials/loading/loading.service';
import { ZoneReportService } from '../../core/shared/form/report/report.service';
import { SocialFavoriteService } from '../shared/services/social-favorites.service';


declare var $: any;
declare var _: any;

export let FRIEND_TABS: any = {
  friends: 'friends',
  followers: 'followers',
  followings: 'followings',
  blacklists: 'blacklists'
};


@Component({
  moduleId: module.id,
  selector: 'z-social-members',
  templateUrl: 'members.component.html',
  styleUrls: ['members.component.css']
})
export class ZSocialMembersComponent implements OnInit {
  errorMessage: string;
  user: SoUser = new SoUser();
  data: any = [];
  list: any = [];
  notifications: any = [];
  newNotifications: any = [];
  currentState: string = FRIEND_TABS.friends; //followers, followings, blacklists
  currentStateTitle: string = 'FRIENDS'; //followers, followings, blacklists
  currentStateTitleNumber: number = 0; //followers, followings, blacklists
  favourite: any;
  nextLink: string;
  totalFriends: number;
  totalFollowers: number;
  totalFollowings: number;
  totalBlacklist: number;
  readonly friendTabs = FRIEND_TABS;
  totalBlacklists: number;

  constructor(private socialService: SocialService,
              private zoneReportService: ZoneReportService,
              private favoriteService: SocialFavoriteService,
              private loadingService: LoadingService) {
  }

  ngOnInit() {
    this.getUser();
  }


  // getDataList(type: string) {
  //   this.currentState = type;
  //   this.list = this.data[type];
  //   return false;
  // }

  getDataList(tab: string, forceOption: boolean = false) {
    if ( this.currentState === tab && !forceOption)
      return;
    this.currentState = tab;
    this.loadingService.start('#users-list');
    switch(tab) {
      case FRIEND_TABS.friends:
        this.socialService.user.getFriends().take(1)
          .finally(() => this.loadingService.stop('#users-list'))
          .subscribe((res: any) => {this.list = res.data;});
        break;
      case FRIEND_TABS.followers:
        this.socialService.user.getFollowerList().take(1)
          .finally(() => this.loadingService.stop('#users-list'))
          .subscribe((res: any) => {this.list = res.data;});
        break;
      case FRIEND_TABS.followings:
        this.socialService.user.getFollowingList().take(1)
          .finally(() => this.loadingService.stop('#users-list'))
          .subscribe((res: any) => {this.list = res.data;});
        break;
      case FRIEND_TABS.blacklists:
        this.list = [];
        this.loadingService.stop('#users-list')
        break;
      default:
        this.loadingService.stop('#users-list')
        console.error('Getting a strange tab. Need implementation? ', tab);
    }
  }

  unfriend(user: any) {
    this.socialService.user.unfriend(user.uuid).subscribe(
      (res: any) => {
        // this.getUser();
        _.remove(this.list, (i: any) => i.uuid == user.uuid);

        // User should unfollow this user as well
        if (user.is_following)
          this.totalFollowings -= 1;

        this.totalFollowers -= 1;
      },
    );
  }



  reportFriend(friend: any) {
    this.zoneReportService.friend(friend.uuid);
    return false;
  }

  addToContacts(uuid: string) {

  }

  addToBlackList(uuid: string) {

  }


  unfollow(item: any) {
    this.socialService.user.unfollow(item.uuid).subscribe(
      (res: any) => {
        // this.getUser();
        if (_.get(res, 'success', false) == true)
          this.totalFollowings -= 1;
        if (this.currentState == this.friendTabs.followings)
          _.remove(this.list, (i: any) => i.uuid == item.uuid );

        if (this.currentState == this.friendTabs.friends)
          item.is_following = false;
      },
    );
  }

  follow(item: any) {
    this.socialService.user.follow(item.uuid).subscribe(
      (res: any) => {
        if (_.get(res, 'success', false) == true)
          this.totalFollowings += 1;
        item.is_following = true;
        console.log('Follow success: ', res.data);
      },
    );
  }



  getUser() {
    this.getDataList(this.currentState, true);
    this.socialService.user.get().toPromise().then(
      (res: any) => {
        // this.data = res.data;
        // this.addFollowingIntoFollower();
        this.totalFriends = _.get(res, 'data.total_friends', 0);
        this.totalFollowers = _.get(res, 'data.total_followers', 0);
        this.totalFollowings = _.get(res, 'data.total_followings', 0);
        this.totalBlacklist = _.get(res, 'data.total_blacklists', 0);
        // this.list = res.data[this.currentState];
      },
      error => this.errorMessage = <any>error
    );
  }
  //
  // addFollowingIntoFollower() {
  //   this.data['followers'] = _.map(this.data['followers'], (follower: any) => {
  //     follower.isFollowing = false;
  //     _.forEach(this.data['followings'], (following: any) => {
  //       if (follower.uuid == following.uuid) {
  //         follower.isFollowing = true;
  //       }
  //     });
  //     return follower;
  //   });
  // }

  getFavourite(uuid: any) {
    this.socialService.user.getFavourite(uuid, 'friend').subscribe(
      (res: any) => {
        this.favourite = res.data;
      }
    );
  }

  addFavourite(uuid: any) {
    this.favoriteService.addFavourite(uuid, 'friend').then((res: any) => this.favourite = res.data);
  }


  focusSearchFriends() {
    $('#searchTopHeader').focus();
  }
}
