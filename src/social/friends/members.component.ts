import { Component, OnInit } from '@angular/core';

import { take, finalize } from 'rxjs/operators';

import { SocialService } from '../shared/services/social.service';
import { SocialFavoriteService } from '../shared/services/social-favorites.service';
import * as fromMember from '../shared/actions/member';
import { ZSharedReportService } from '@wth/shared/shared/components/zone/report/report.service';
import { LoadingService } from '@wth/shared/shared/components/loading/loading.service';
import { SoUser } from '@wth/shared/shared/models';
import { Constants } from '@wth/shared/constant';

export let FRIEND_TABS: any = {
  friends: 'friends',
  followers: 'followers',
  followings: 'followings',
  blacklists: 'blacklists',
  received: 'received',
  pending: 'pending'
};

@Component({
  selector: 'z-social-members',
  templateUrl: 'members.component.html',
  styleUrls: ['members.component.scss']
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
  totalReceivedRequests: number;
  totalPendingRequests: number;
  readonly friendTabs = FRIEND_TABS;
  showLoading: boolean;
  loading: boolean;

  constructor(
    private socialService: SocialService,
    private zoneReportService: ZSharedReportService,
    private favoriteService: SocialFavoriteService,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {
    this.getUser();
    this.showLoading = document.getElementById('users-list') !== null;
  }

  getDataList(tab: string, forceOption: boolean = false) {
    if (this.currentState === tab && !forceOption) return;
    this.currentState = tab;
    this.startLoading();
    switch (tab) {
      case FRIEND_TABS.friends:
        this.socialService.user
          .getFriends()
          .pipe(
            take(1),
            finalize(() => this.stopLoading())
          )
          .subscribe((res: any) => {
            this.list = res.data;
            this.totalFriends = this.list.length;
            for (let i = 0; i < this.list.length; i++) {
              _.set(
                this.list,
                `${i}.friend_status`,
                Constants.friendStatus.accepted
              );
            }
          });
        break;
      case FRIEND_TABS.followers:
        this.socialService.user
          .getFollowerList()
          .pipe(
            take(1),
            finalize(() => this.stopLoading())
          )
          .subscribe((res: any) => {
            this.list = res.data;
            this.totalFollowers = this.list.length;
          });
        break;
      case FRIEND_TABS.followings:
        this.socialService.user
          .getFollowingList()
          .pipe(
            take(1),
            finalize(() => this.stopLoading())
          )
          .subscribe((res: any) => {
            this.list = res.data;
            this.totalFollowings = this.list.length;
            for (let i = 0; i < this.list.length; i++) {
              _.set(this.list, `${i}.is_following`, true);
            }
          });
        break;
      case FRIEND_TABS.blacklists:
        this.list = [];
        this.stopLoading();
        break;
      case FRIEND_TABS.received:
        this.socialService.user
          .getReceivedRequests()
          .toPromise()
          .then((res: any) => {
            this.list = res.data;
            this.stopLoading();
          })
          .catch(() => this.stopLoading());
        break;
      case FRIEND_TABS.pending:
        this.socialService.user
          .getPendingRequests()
          .toPromise()
          .then((res: any) => {
            console.debug('this.list - ', this.list, res);
            this.list = res.data;
            this.stopLoading();
          })
          .catch(() => this.stopLoading());
        break;
      default:
        this.stopLoading();
        console.error('Getting a strange tab. Need implementation? ', tab);
    }
  }

  startLoading() {
    this.loading = true;
    if (this.showLoading) this.loadingService.start('#users-list');
  }

  stopLoading() {
    this.loading = false;
    if (this.showLoading) this.loadingService.stop('#users-list');
  }

  onAction(event?: any) {
    switch (event.action) {
      case fromMember.ACTIONS.ADD_FRIEND:
        this.totalFollowings -= 1;
        this.totalFollowers -= 1;
        this.totalFriends += 1;
        break;
      case fromMember.ACTIONS.UNFRIEND:
        this.totalFriends -= 1;
        break;
      case fromMember.ACTIONS.FOLLOW:
        this.totalFollowings += 1;
        break;
      case fromMember.ACTIONS.UNFOLLOW:
        this.totalFollowings -= 1;
        break;
      case fromMember.ACTIONS.DELETE:
        if (this.currentState == FRIEND_TABS.pending)
          this.totalPendingRequests -= 1;
        if (this.currentState == FRIEND_TABS.received)
          this.totalReceivedRequests -= 1;
        break;
      default:
        break;
    }
  }

  reportFriend(friend: any) {
    this.zoneReportService.friend(friend.uuid);
    return false;
  }

  getUser() {
    this.getDataList(this.currentState, true);
    this.socialService.user
      .get()
      .toPromise()
      .then((res: any) => {
        // this.data = res.data;
        // this.addFollowingIntoFollower();
        this.totalFriends = _.get(res, 'data.total_friends', 0);
        this.totalFollowers = _.get(res, 'data.total_followers', 0);
        this.totalFollowings = _.get(res, 'data.total_followings', 0);
        this.totalBlacklist = _.get(res, 'data.total_blacklists', 0);
        this.totalReceivedRequests = _.get(
          res,
          'data.total_received_requests',
          0
        );
        this.totalPendingRequests = _.get(
          res,
          'data.total_pending_requests',
          0
        );
        // this.list = res.data[this.currentState];
      }, error => (this.errorMessage = <any>error));
  }

  getFavourite(uuid: any) {
    this.socialService.user
      .getFavourite(uuid, 'friend')
      .subscribe((res: any) => {
        this.favourite = res.data;
      });
  }

  addFavourite(uuid: any) {
    this.favoriteService
      .addFavourite(uuid, 'friend')
      .then((res: any) => (this.favourite = res.data));
  }

  focusSearchFriends() {
    $('#searchTopHeader').focus();
  }
}
