import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Store } from '@ngrx/store';
import { combineLatest } from 'rxjs/operators';

import { ZSocialCommunityFormEditComponent } from '../shared/form/edit.component';
import { ZSocialCommunityFormPreferenceComponent } from '../shared/form/preferences.component';
import { SocialService } from '../../shared/services/social.service';
import { PostListComponent } from '../../shared/second-routes/post/post-list.component';
import { SocialFavoriteService } from '../../shared/services/social-favorites.service';
import { EntitySelectComponent } from '@wth/shared/shared/components/entity-select/entity-select.component';
import { User } from '@wth/shared/shared/models';
import { AuthService, UserService } from '@shared/services';
import { WthConfirmService } from '@wth/shared/shared/components/confirmation/wth-confirm.service';
import { ToastsService } from '@shared/shared/components/toast/toast-message.service';
import { ZSharedReportService } from '@wth/shared/shared/components/zone/report/report.service';
import { Constants } from '@wth/shared/constant';
import { SHORTCUT_ADD_MULTI_DONE } from '../../shared/reducers/index';
import { fadeInAnimation } from '@wth/shared/shared/animations/route.animation';
import { WTab } from '@shared/components/w-nav-tab/w-nav-tab';

declare let _: any;
declare let $: any;

const EMPTY_DEFAULT_TABS: any = {
  post: false,
  about: false,
  members: false,
  invitations: false,
  joinRequests: false,
  blacklist: false
};

@Component({
  selector: 'z-social-community-detail',
  templateUrl: 'detail.component.html',
  animations: [fadeInAnimation],
  styleUrls: ['detail.component.scss']
})
export class ZSocialCommunityDetailComponent implements OnInit, OnDestroy {
  errorMessage: string = '';

  tooltip: any = Constants.tooltip;

  tab: any = {
    post: 'post',
    about: 'about',
    members: 'members',
    invitations: 'invitations',
    join_requests: 'join_requests',
    blacklist: 'blacklist'
  };

  tabs: WTab[] = [
    {
      name: 'Post',
      link: 'post',
      icon: null,
      number: null,
      type: 'tab'
    },
    {
      name: 'About',
      link: 'about',
      icon: null,
      number: null,
      type: 'tab'
    },
    {
      name: 'Members',
      link: 'members',
      icon: null,
      number: null,
      type: 'tab'
    },
    {
      name: 'Invitations',
      link: 'invitations',
      icon: null,
      number: null,
      type: 'tab'
    },
    {
      name: 'Join Requests',
      link: 'join_requests',
      icon: null,
      number: null,
      type: 'tab'
    }
  ];


  tabData: any = [
    {
      key: 'post',
      value: 'Post'
    },
    {
      key: 'about',
      value: 'About'
    },
    {
      key: 'members',
      value: 'Members'
    },
    {
      key: 'invitations',
      value: 'Invitations'
    },
    {
      key: 'join_requests',
      value: 'Join Requests'
    }/*,
    {key: 'blacklist',
      value: 'Blacklist'
    }*/
  ];

  selectedTab: string = 'post';
  selectedTabTitle: any;

  community: any = null;
  uuid: string;
  user: any;
  invitationId: string;
  joinRequestId: string;
  tabItems: Array<any> = [];
  isAdmin: boolean = false;
  isMember: boolean = false;
  is_close: boolean = true;
  favourite: any;
  userSettings: any;
  loading: boolean = true;

  activeTabs: any = EMPTY_DEFAULT_TABS;
  readonly communitiesUrl: string = '/' + Constants.urls.communities;

  @ViewChild('modalEdit') modalEdit: ZSocialCommunityFormEditComponent;
  @ViewChild('modalPreference') modalPreference: ZSocialCommunityFormPreferenceComponent;
  @ViewChild('users') users: EntitySelectComponent;
  @ViewChild('posts') posts: PostListComponent;

  profile$: Observable<User>;

  private destroySubject: Subject<any> = new Subject<any>();

  constructor(public authService: AuthService,
              private route: ActivatedRoute,
              private router: Router,
              private userService: UserService,
              private wthConfirmService: WthConfirmService,
              private toastsService: ToastsService,
              private zoneReportService: ZSharedReportService,
              public favoriteService: SocialFavoriteService,
              private store: Store<any>,
              private socialService: SocialService) {
    this.profile$ = this.userService.getAsyncProfile();
  }

  ngOnInit() {
    this.selectedTabTitle = _.find(this.tabData, ['key', this.selectedTab]);

    this.route.paramMap.pipe(
      combineLatest(this.route.queryParamMap, (paramMap, queryParamMap) => {
        if (this.uuid !== paramMap.get('id')) {
          this.uuid = paramMap.get('id');
          this.getCommunity(this.uuid);
        }
        this.selectedTab = queryParamMap.get('tab');
        this.selectedTabTitle = _.find(this.tabData, ['key', (this.selectedTab || 'post')]);
        console.debug(paramMap, queryParamMap, this.selectedTab);
        return [this.uuid, this.selectedTab];
      })
    ).subscribe(() => {
      this.setTabVisibility();
      if (this.selectedTab !== undefined)
        this.getTabItems(this.uuid, this.selectedTab);
    });
  }

  ngOnDestroy() {
    this.destroySubject.next('');
    this.destroySubject.unsubscribe();
  }

  tabAction(event: any) {
    console.log(event);
  }

  onPreference() {
    this.modalPreference.modal.open();
    return false;
  }

  onEdit() {
    this.modalEdit.modal.open();
    return false;
  }

  onUpdated(item: any) {
    if (item) {
      this.getCommunity(this.uuid);
    }
  }

  onReport() {
    this.zoneReportService.community(this.uuid);
    return false;
  }

  addFavourite(uuid: any) {
    this.favoriteService.addFavourite(uuid, 'community')
      .then((res: any) => this.userSettings.favorite = !this.userSettings.favorite);
  }

  getUserSettings(uuid: any) {
    this.socialService.community.getUserSettings(uuid).take(1).subscribe(
      (res: any) => {
        this.userSettings = res.data;
      }
    );
  }

  toggleComNotification(uuid: any) {
    this.socialService.community.toggleComNotification(uuid).subscribe(
      (res: any) => {
        this.userSettings = res.data;
      }
    );
  }

  confirmLeaveCommunity() {
    this.socialService.community.confirmLeaveCommunity(this.community)
      .then((community: any) =>
        this.router.navigateByUrl(this.communitiesUrl));
  }

  onCoverAction(event: any) {
    if (event.action == 'updateItem') {
      this.updateCommunity(event.body);
    }
  }

  updateCommunity(body: any): void {

    this.socialService.community.updateCommunity(this.community.uuid, body)
      .subscribe((result: any) => {
          console.log('update community sucess: ', result);
          let toastMsg = '';
          if (_.has(body, 'profile_image'))
            toastMsg = 'You have updated profile image successfully';
          else if (_.has(body, 'cover_image'))
            toastMsg = 'You have updated cover image of this community successfully';
          else
            toastMsg = result.message;

          this.toastsService.success(toastMsg);
          this.favoriteService.updateFavorite(result.data, 'community');
        },
        error => {
          this.toastsService.danger(this.errorMessage);
          console.log(error);
        }
      );
  }

  askToJoin() {
    this.socialService.community.askToJoin(this.uuid)
      .subscribe((result: any) => {
          this.joinRequestId = result.data.id;
        },
        (error: any) => {
          console.log('error', error);
        });
  }

  cancelJoinRequest(joinRequestId: any) {
    this.socialService.community.cancelJoinRequest(this.uuid, joinRequestId).subscribe(
      (res: any) => {
        this.joinRequestId = undefined;

        // Update join request count
        this.community.join_request_count -= 1;
      },
      error => {
        this.errorMessage = <any>error;
      }
    );
  }

  cancelInvitation(invitationId: any) {
    $('#invitation_' + invitationId).remove();
    this.socialService.community.cancelInvitation(this.uuid, invitationId)
      .subscribe(
        (res: any) => {
          // Update invitation count
          this.community.invitation_count -= 1;
        },
        error => {
          this.errorMessage = <any>error;
        }
      );
  }

  acceptJoinRequest(item: any) {
    $('#invitation_' + item.id).remove();
    this.socialService.community.acceptJoinRequest(this.uuid, item.inviter.uuid).subscribe(
      (res: any) => {
        // Update join request count
        this.community.join_request_count -= 1;
      },
      error => {
        this.errorMessage = <any>error;
      }
    );
  }

  deleteMember(user: any) {
    this.user = user;
    this.wthConfirmService.confirm({
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      message: `Are you sure to delete member ${this.user.name} from the community?`,
      header: 'Delete Member',
      accept: () => {
        this.socialService.community.deleteMember(this.uuid, user.uuid).subscribe(
          (res: any) => {
            this.toastsService.success('You deleted member successfully');
            _.remove(this.tabItems, (item: any) => item.user.uuid === user.uuid);

            // Update community member count
            this.community.member_count -= 1;
          },
          error => {
            this.toastsService.danger(error);
            // this.loadingService.stop();
          }
        );
      }
    });
  }

  makeAdmin(user: any) {
    this.user = user;
    this.wthConfirmService.confirm({
      acceptLabel: 'Done',
      rejectLabel: 'Cancel',
      message: `Are you sure to change role of member ${this.user ? this.user.name : ''} to admin?`,
      header: 'Make admin',
      accept: () => {
        this.socialService.community.makeAdmin(this.uuid, user.uuid).subscribe(
          (res: any) => {
            this.toastsService.success(`You have changed ${this.user ? this.user.name : ''} role to ADMIN successfully`);
            $('#user_' + user.uuid).find('span.member-role').text('Admin');
            this.community.admin_count += 1;
          },
          error => {
            this.toastsService.danger(error);
            // this.loadingService.stop();
          }
        );
      }
    });
  }

  chooseMembers() {
    this.users.open({url: `zone/social_network/users_search/users_not_in_community/${this.uuid}`});

  }

  inviteMembers(response: any) {
    let user_ids = _.map(response.items, 'uuid');
    this.socialService.community.inviteMembers(this.uuid, user_ids)
      .subscribe((result: any) => {
          console.log('invited friends');
          this.getTabItems(this.uuid, this.selectedTab);
          this.community.invitation_count += user_ids.length;
          console.log('get tab items for: ' + this.selectedTab);
        },
        error => {
          console.log('error', error);
        });
  }

  onReportMember(reportee_id: string, reason: string = '') {
    this.socialService.community.onReportMember(reportee_id, this.uuid, reason)
      .toPromise().then((result: any) => {
        console.log('reported member');
      },
      error => {
        console.log('error', error);
      });
  }

  onDelete() {
    this.socialService.community.confirmDeleteCommunity(this.community)
      .then((community: any) => this.router.navigateByUrl(this.communitiesUrl));
  }

  onLoadMore() {
    if (this.activeTabs.post)
      this.posts.viewMorePosts();
  }

  private getCommunity(uuid: string): Promise<any> {
    return this.socialService.community.getCommunity(uuid).toPromise().then(
      (res: any) => {
        // this.item = res.data;
        this.loading = false;
        this.community = res.data;
        this.socialService.community.currentCommunity = this.community;

        this.isAdmin = _.get(res, 'check_user.is_admin');
        this.isMember = _.get(res, 'check_user.is_member');
        this.invitationId = _.get(res, 'check_user.invitationId');
        this.joinRequestId = _.get(res, 'check_user.joinRequestId');

        //  Grant edit profile / cover image privilege to community admins
        this.community.canEdit = this.isAdmin;

        if (res.shortcut) {
          this.store.dispatch({type: SHORTCUT_ADD_MULTI_DONE, payload: res.shortcut});
        }
      },
      error => {
        this.loading = false;
        this.errorMessage = <any>error;
      }
    );
  }


  private getTabItems(uuid: string, tabName: string): void {
    this.tabItems.length = 0;
    if (!tabName)
      return;

    this.socialService.community.getTabItems(uuid, tabName)
      .toPromise()
      .then(
        (res: any) => {
          if ([this.tab.about, this.tab.post].indexOf(this.selectedTab) == -1)
            this.tabItems = res.data;
          // Update member_count, invitation_count, join_request_count
          switch (this.selectedTab) {
            case this.tab.members:
              _.set(this.community, 'member_count', this.tabItems.length);
              break;
            case this.tab.invitations:
              _.set(this.community, 'invitation_count', this.tabItems.length);
              break;
            case this.tab.joinRequests:
              _.set(this.community, 'join_request_count', this.tabItems.length);
              break;
          }
        },
        error => {
          this.errorMessage = <any>error;
        }
      );
  }

  private setTabVisibility() {
    this.activeTabs = {...EMPTY_DEFAULT_TABS, [this.selectedTab || this.tab.post]: true};
  }

}
