import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ServiceManager } from '../../core/shared/services/service-manager';
import { Constants } from '../../core/shared/config/constants';
import { SocialService } from '../shared/services/social.service';
import { ConfirmationService } from 'primeng/components/common/api';
import { LoadingService } from '../../core/partials/loading/loading.service';
import { subscribeOn } from 'rxjs/operator/subscribeOn';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-social-search',
  templateUrl: 'search.component.html'
})

export class ZSocialSearchResultComponent implements OnInit, OnDestroy {
  show: boolean = false;
  type: string = '';
  result: any;
  groups: any;
  showMore: boolean = false;
  sub: any;
  favourite: any; // toggle favourites status for members, communities

  searchPostedBy: string = '';
  searchDate: string = '';
  searchDateValue: Date;
  events:any;

  readonly comUserStatus = Constants.soCommunityUserStatus;
  readonly friendStatus = Constants.friendStatus;

  constructor(private router: Router,
              public serviceManager: ServiceManager,
              private loadingService: LoadingService,
              private confirmationService: ConfirmationService,
              private socialService: SocialService) {

  }

  ngOnInit() {
    this.events = this.router.events
      .filter((event:any) => event instanceof NavigationEnd)
      .subscribe((event:NavigationEnd) => {
        let paths = event.url.toString().split('/')[1].split('?');
        if (paths[1]) {
          let q = paths[1].substring(2, paths[1].length);
          this.serviceManager.getApi().post(`zone/social_network/search`, {
            q: q,
            types: ['user', 'community', 'post']
          }).subscribe(
            (res: any) => {
              this.result = res.data;
              this.groups = Object.keys(res.data);
              // this.groups = _.pull(this.groups, 'posts');
              console.log(this.result, this.groups);
            }
          );
        }
      });
  }

  ngOnDestroy() {
    this.events.unsubscribe();
  }

  toggleFavourite(item: any, group: string) {
    this.socialService.user.toggleFavourites(item.uuid, group).subscribe(
      (res: any) => {
        if(!_.isEmpty(this.favourite)) {
          this.favourite = undefined;
        }
        else {
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

  sendJoinRequest(community: any) {
    this.socialService.community.askToJoin(community.uuid)
      .subscribe((result: any) => {
          // TODO: Update status of community
          // this.invitationId = result.data.id;
          community.user_status = Constants.soCommunityUserStatus.joinRequestSent;
        },
        (error: any) => {
          console.log('error', error);
        });
  }

  confirmLeaveCommunity(community: any) {
    // Check if there are other admins beside current user in community
    // If not, he must pick another one before leaving
    // let enoughAdmins = community.admin_count > 1 ? true : false;
    // let pickAnotherAdmin = this.userService.profile.uuid == this.item.admin.uuid && !enoughAdmins;
    let pickAnotherAdmin = false;

    this.confirmationService.confirm({
      message: pickAnotherAdmin ?
        `Hi there, you need to pick another admin for the community ${community.name} before leaving.` :
        `Are you sure to leave the community ${community.name}?`,
      header: 'Leave Community',
      accept: () => {
        if (pickAnotherAdmin) {
          // Navigate to member tab
          this.serviceManager.getRouter().navigate([Constants.urls.communities, community.uuid], { queryParams: {tab: 'members', skipLocationChange: true }});
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
          community.user_status = this.comUserStatus.stranger;
        }
      );
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
