import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ServiceManager } from '../../core/shared/services/service-manager';
import { Constants } from '../../core/shared/config/constants';
import { SocialService } from '../shared/services/social.service';
import { ConfirmationService } from 'primeng/components/common/api';
import { LoadingService } from '../../core/shared/components/loading/loading.service';
import { UrlService } from '../../core/shared/services/url.service';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-social-search-detail',
  templateUrl: 'search-detail.component.html'
})

export class ZSocialSearchDetailComponent implements OnInit, OnDestroy {
  show: boolean = false;
  type: string = '';
  result: any;
  group: any;
  showMore: boolean = false;
  sub: any;
  favourite: any; // toggle favourites status for members, communities

  searchPostedBy: string = '';
  searchDate: string = '';
  events:any;
  show_more_posts:any;
  q:any;
  filter:any;
  filterDate:any;
  nextLink:any;

  readonly comUserStatus = Constants.soCommunityUserStatus;
  readonly friendStatus = Constants.friendStatus;

  constructor(private router: Router,
              public serviceManager: ServiceManager,
              private loadingService: LoadingService,
              private confirmationService: ConfirmationService,
              private urlService: UrlService,
              private socialService: SocialService) {

  }

  ngOnInit() {
    this.events = this.router.events
      .filter((event:any) => event instanceof NavigationEnd)
      .subscribe((event:NavigationEnd) => {
        this.group = this.urlService.getId();
        this.q = this.urlService.getQuery()['q'];
        this.filter = this.urlService.getQuery()['filter_post'];
        this.filterDate = this.urlService.getQuery()['filter_date'];
        if (this.q) {
          let query:any = {q : this.q};
          if (this.filter) {
            query.filter = this.filter;
          }
          if (this.filterDate) {
            query.filter_date = this.filterDate;
          }
          this.serviceManager.getApi().get(`zone/social_network/search/${this.group}`, query).subscribe(
            (res: any) => {
              this.result = res.data;
              this.nextLink = res.page_metadata.links.next;
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
    this.socialService.community.confirmLeaveCommunity(community).then((res:any) => community.user_status = this.comUserStatus.stranger);
  }

  // leaveCommunity(community: any) {
  //   this.socialService.community.leaveCommunity(community.uuid)
  //     .subscribe((response: any) => {
  //         community.user_status = this.comUserStatus.stranger;
  //       }
  //     );
  // }

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

  onLoadMore() {
    if (this.nextLink) {
      this.serviceManager.getApi().get(this.nextLink).subscribe(
        (res: any) => {
          _.map(res.data, (v: any)=> {
            this.result.push(v);
          });
          this.nextLink = res.page_metadata.links.next;
        }
      );
    }
  }
}
