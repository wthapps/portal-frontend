import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ZoneReportService } from '../../shared/form/report/report.service';
import { ConfirmationService } from 'primeng/components/common/api';
import { ZSocialCommunityFormEditComponent } from '../shared/form/edit.component';
import { ZSocialCommunityFormPreferenceComponent } from '../shared/form/preferences.component';
import { ApiBaseService } from '../../../core/shared/services/apibase.service';
import { UserService } from '../../../core/shared/services/user.service';
import { ToastsService } from '../../../core/partials/toast/toast-message.service';
import { SocialService } from '../../shared/services/social.service';
// import { MemberListInviteComponent } from '../member/member-list-invite.component';
import { Constants } from '../../../core/shared/config/constants';
import { LoadingService } from '../../../core/partials/loading/loading.service';
import { PostListComponent } from '../../shared/post/post-list.component';
import { EntitySelectComponent } from '../../../core/partials/entity-select/entity-select.component';
import { PhotoModalDataService } from '../../../core/shared/services/photo-modal-data.service';
import { Subscription, Observable } from 'rxjs';

declare let _: any;
declare let $: any;

@Component({
  moduleId: module.id,
  selector: 'z-social-community-detail',
  templateUrl: 'detail.component.html'
})


export class ZSocialCommunityDetailComponent implements OnInit, OnDestroy {
  errorMessage: string = '';

  tab: any = {
    post: 'post',
    about: 'about',
    members: 'members',
    invitations: 'invitations',
    joinRequests: 'join_requests',
    blacklist: 'blacklist'
  };

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
    {
      key: 'blacklist',
      value: 'Blacklist'
    }*/
  ];

  selectedTab: string = 'post';
  selectedTabTitle: string ;

  item: any = null;
  community: any = null;
  uuid: string;
  // community_id: string;
  user: any;
  // invitation: any = null;
  invitationId: string;
  joinRequestId: string;
  tabItems: Array<any> = new Array<any>();
  // users: Array<any> = [];
  isAdmin: boolean = false;
  isMember: boolean = false;
  is_close: boolean = true;
  favourite: any;

  isPostTab: boolean = true;
  isAboutTab: boolean = false;
  isMemberTab: boolean = false;
  isInvitationTab: boolean = false;
  isJoinRequestTab: boolean = false;
  isBlacklistTab: boolean = false;
  readonly communitiesUrl: string = '/' + Constants.urls.communities;

  @ViewChild('modalEdit') modalEdit: ZSocialCommunityFormEditComponent;
  @ViewChild('modalPreference') modalPreference: ZSocialCommunityFormPreferenceComponent;
  @ViewChild('users') users: EntitySelectComponent;
  // @ViewChild('users') users: MemberListInviteComponent;
  @ViewChild('posts') posts: PostListComponent;

  closeObs$: Observable<any>;

  // Subscription for photo select in modal
  nextPhotoSubscription: Subscription;

  constructor(private apiBaseService: ApiBaseService,
              private route: ActivatedRoute,
              private router: Router,
              private userService: UserService,
              private confirmationService: ConfirmationService,
              private loadingService: LoadingService,
              private toastsService: ToastsService,
              private photoSelectDataService: PhotoModalDataService,
              private zoneReportService: ZoneReportService,
              private socialService: SocialService) {


    this.closeObs$ = this.photoSelectDataService.closeObs$.merge(this.photoSelectDataService.dismissObs$);
  }

  ngOnInit() {
    this.selectedTabTitle = _.find(this.tabData, ['key', this.selectedTab]);

    // this.postList.type = 'community';
    this.route.params.subscribe(params => {
      this.uuid = params['id'];
      this.getCommunity(this.uuid);
      this.checkCurrentUser(this.uuid);

    });

    this.route.queryParams.subscribe(
      (queryParams: any) => {
        this.selectedTab = queryParams['tab'];
        this.selectedTabTitle = _.find(this.tabData, ['key', queryParams['tab']]);
        this.setTabVisibility();
        if (this.selectedTab !== undefined)
          this.getTabItems(this.uuid, this.selectedTab);
        // this.isMember = true; // testing
      }
    );

  }

  ngOnDestroy() {
    // this.loadSubscription.unsubscribe();
    if (this.nextPhotoSubscription)
      this.nextPhotoSubscription.unsubscribe();
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
    this.socialService.user.addFavourites(uuid, 'community').subscribe(
      (res: any) => {

      }
    );
  }

  getFavourite(uuid: any) {
    this.socialService.user.getFavourite(uuid, 'community').subscribe(
      (res: any) => {
        this.favourite = res.data;
      }
    );
  }

  onLeave() {
    // Check if there are other admins beside current user in community
    // If not, he must pick another one before leaving
    let enoughAdmins = this.community.admin_count > 1 ? true : false;
    let pickAnotherAdmin = this.userService.profile.uuid == this.item.admin.uuid && !enoughAdmins;

    this.confirmationService.confirm({
      message: pickAnotherAdmin ?
        `Hi there, you need to pick another admin for the community ${this.item.name} before leaving.` :
        `Are you sure to leave the community ${this.item.name}?`,
      header: 'Leave Community',
      accept: () => {
        if (pickAnotherAdmin) {
          // Navigate to member tab
          this.router.navigate([this.communitiesUrl, this.uuid], { queryParams: {tab: 'members', skipLocationChange: true }});
        } else {
          this.leaveCommunity();
        }
      }
    });

    return false;
  }

  leaveCommunity() {
    this.loadingService.start();
    this.socialService.community.leaveCommunity(this.uuid)
      .subscribe((response: any) => {
          this.loadingService.stop();
          this.router.navigateByUrl(this.communitiesUrl);
        },
        error => {
          this.toastsService.danger(error);
          this.loadingService.stop();
        }
      );
  }

  selectPhoto(callback?: any) {
    this.photoSelectDataService.open();
    this.nextPhotoSubscription = this.photoSelectDataService.nextObs$
      .take(1) // User can only select 1 photo to change profile avatar / cover image
      .takeUntil(this.closeObs$).subscribe(
        (photo: any) => {
          callback(photo);
        });
  }

  uploadPhoto(callback?: any) {
  //  For later support
  }

  changeProfileImage(event: any) {
    console.log('chnage Avatar image');
    this.selectPhoto((photos: any) => {
      // Update avatar image
      let img_url = photos[0].url;
      this.item.profile_image = img_url;
      this.updateCommunity({'profile_image': img_url}, this.item.profile_image);
      })
  }

  changeCoverImage(event: any) {
    console.log('changeCoverImage');
    this.selectPhoto((photos: any) => {
      // Update covert image
      let img_url = photos[0].url;
      this.item.cover_image = img_url;
      this.updateCommunity({'cover_image': img_url}, this.item.cover_image);
    })
  }


  updateCommunity(body: any, updateItem?: any): void {
    // this.loadingService.start();
    this.socialService.community.updateCommunity(this.community.uuid, body)
      .subscribe((result: any) => {
          // stop loading
          // updateItem = result.data.img;
          // this.loadingService.stop();
          console.log('update community sucess: ', result);
          this.toastsService.success(result.message);
        },
        error => {
          // stop loading
          // this.loadingService.stop();
          this.toastsService.danger(this.errorMessage);
          console.log(error);
        }
      );
  }

  askToJoin() {
    // this.apiBaseService.post(`${this.soCommunitiesUrl}/${this.uuid}/invitations`)
    this.socialService.community.askToJoin(this.uuid)
      .subscribe((result: any) => {
          // this.invitation = result.data;
          this.invitationId = result.data.id;
        },
        (error: any) => {
          console.log('error', error);
        });
  }

  cancelJoinRequest(joinRequestId: any) {
    // this.apiBaseService.delete(`${this.soCommunitiesUrl}/${this.uuid}/invitations/${joinRequestId}`).subscribe(
    this.socialService.community.cancelJoinRequest(this.uuid, joinRequestId).subscribe(
      (res: any)=> {
        // this.invitation = undefined;
        console.log('cancel join request: ' + joinRequestId);

        // Update join request count
        this.community.join_request_count -= 1;
      },
      error => {
        // this.loadingService.stop('.zone-social-cover');
        this.errorMessage = <any>error;
      }
    );
  }

  cancelInvitation(invitationId: any) {
    this.invitationId = invitationId;
    // this.apiBaseService.delete(`${this.soCommunitiesUrl}/${this.uuid}/invitations/${invitationId}`).subscribe(
    this.socialService.community.cancelInvitation(this.uuid, invitationId).subscribe(
      (res: any)=> {
        $('#invitation_' + this.invitationId).remove();

        // Update invitation count
        this.community.invitation_count -= 1;
        console.log('after cancel invitation', this.invitationId);
      },
      error => {
        // this.loadingService.stop('.zone-social-cover');
        this.errorMessage = <any>error;
      }
    );
  }

  acceptJoinRequest(item: any) {
    this.invitationId = item.id;
    // this.apiBaseService.post(`${this.soCommunitiesUrl}/accept_join_request/`,JSON.stringify({uuid: this.uuid, user_id: item.inviter.uuid})).subscribe(
    this.socialService.community.acceptJoinRequest(this.uuid, item.inviter.uuid).subscribe(
      (res: any)=> {
        $('#invitation_' + this.invitationId).remove();

        // Update join request count
        this.community.join_request_count -= 1;
        console.log('after accept invitation', this.invitationId);
      },
      error => {
        // this.loadingService.stop('.zone-social-cover');
        this.errorMessage = <any>error;
      }
    );
  }

  deleteMember(user: any) {
    this.user = user;
    this.confirmationService.confirm({
      message: `Are you sure to delete member ${this.user.name} from the community?`,
      header: 'Delete Member',
      accept: () => {
        // this.apiBaseService.delete(`${this.soCommunitiesUrl}/${this.uuid}/members/${user.uuid}`).subscribe(
        this.socialService.community.deleteMember(this.uuid, user.uuid).subscribe(
          (res: any)=> {
            this.toastsService.success('You deleted member successfully');
            $('#user_' + user.uuid).remove();

            // Update community member count
            this.community.member_count -= 1;
            // this.loadDataBySelectedTab();
          },
          error => {
            this.toastsService.danger(error);
            this.loadingService.stop();
          }
        );
      }
    });
  }

  makeAdmin(user: any) {
    this.user = user;
    this.confirmationService.confirm({
      message: `Are you sure to change role of member ${this.user ? this.user.name : ''} to admin?`,
      header: 'Make admin',
      accept: () => {
        this.socialService.community.makeAdmin(this.uuid, user.uuid).subscribe(
          (res: any)=> {
            this.toastsService.success(`You have changed ${this.user ? this.user.name : ''} role to ADMIN successfully`);
            $('#user_' + user.uuid).find('span.member-role').text('Admin');
            this.community.admin_count += 1;
          },
          error => {
            this.toastsService.danger(error);
            this.loadingService.stop();
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
      .subscribe((result: any) => {
          console.log('reported member');
        },
        error => {
          console.log('error', error);
        });
  }

  onDelete(item: any) {

  }

  onLoadMore() {
    this.posts.viewMorePosts();
  }

  private getCommunity(uuid: string) {
    // this.apiBaseService.get(`${this.soCommunitiesUrl}/${uuid}`).subscribe(
    this.socialService.community.getCommunity(uuid).subscribe(
      (res: any)=> {
        this.item = res.data;
        this.community = res.data;
        this.socialService.community.currentCommunity = this.community;
        // Check if this user is a community member

        // if (this.item.community_users ) {
        //   let users = _.map(this.item.community_users, (c: any) => { return c.user.uuid });
        //   this.isMember = _.indexOf(users, this.userService.profile.uuid ) > -1 ? true : false;
        // }
        // this.isAdmin = this.userService.profile.uuid == this.item.admin.uuid ? true : false;

      },
      error => {
        this.errorMessage = <any>error;
      }
    );
  }


  private checkCurrentUser(uuid: string) {
    // this.apiBaseService.get(`${this.soCommunitiesUrl}/${uuid}/check_current_user/`).subscribe(
    this.socialService.community.checkCurrentUser(uuid).subscribe(
      (res: any)=> {
        this.isAdmin = res.data.is_admin;
        this.isMember = res.data.is_member;
        if (res.data.invitationId)
          this.invitationId = res.data.invitationId;
        if (res.data.joinRequestId)
          this.joinRequestId = res.data.joinRequestId;
        // this.invitation = res.data.has_invitation;

        // this.isAdmin = this.userService.profile.uuid == this.item.admin.uuid ? true : false;

      },
      error => {
        this.errorMessage = <any>error;
      }
    );
  }

  private getTabItems(uuid: string, tabName: string) {
    this.tabItems = [];
    if (tabName === undefined)
      return;
    // this.apiBaseService.get(`${this.soCommunitiesUrl}/${uuid}/${tabName}`).subscribe(
    this.socialService.community.getTabItems(uuid, tabName).subscribe(
      (res: any)=> {
        this.tabItems = res.data;

        // Update member_count, invitation_count, join_request_count
        switch(this.selectedTab) {
          case this.tab.members:
            _.set(this.community, 'member_count', this.tabItems.length );
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

  // private checkJoinRequestStatus(uuid: string) {
  //   // this.apiBaseService.get(`${this.soCommunitiesUrl}/${uuid}/join_request_status`).subscribe(
  //   this.socialService.community.checkJoinRequestStatus(uuid).subscribe(
  //     (result: any) => {
  //       // this.invitation = result.data;
  //       this.invitationId = result.data.id;
  //     },
  //     error => {
  //       console.log('error', error);
  //     });
  // }
  private setTabVisibility() {
    switch (this.selectedTab) {
      case this.tab.post:
        this.isPostTab = true;
        this.isAboutTab = false;
        this.isMemberTab = false;
        this.isInvitationTab = false;
        this.isJoinRequestTab = false;
        this.isBlacklistTab = false;
        break;
      case this.tab.about:
        this.isPostTab = false;
        this.isAboutTab = true;
        this.isMemberTab = false;
        this.isInvitationTab = false;
        this.isJoinRequestTab = false;
        this.isBlacklistTab = false;
        break;
      case this.tab.members:
        this.isPostTab = false;
        this.isAboutTab = false;
        this.isMemberTab = true;
        this.isInvitationTab = false;
        this.isJoinRequestTab = false;
        this.isBlacklistTab = false;
        break;
      case this.tab.invitations:
        this.isPostTab = false;
        this.isAboutTab = false;
        this.isMemberTab = false;
        this.isInvitationTab = true;
        this.isJoinRequestTab = false;
        this.isBlacklistTab = false;
        break;
      case this.tab.joinRequests:
        this.isPostTab = false;
        this.isAboutTab = false;
        this.isMemberTab = false;
        this.isInvitationTab = false;
        this.isJoinRequestTab = true;
        this.isBlacklistTab = false;
        break;
      case this.tab.blacklist:
        this.isPostTab = false;
        this.isAboutTab = false;
        this.isMemberTab = false;
        this.isInvitationTab = false;
        this.isJoinRequestTab = false;
        this.isBlacklistTab = true;
        break;
      default:
        this.selectedTab = undefined;
        this.isPostTab = true;
        this.isAboutTab = false;
        this.isMemberTab = false;
        this.isInvitationTab = false;
        this.isJoinRequestTab = false;
        this.isBlacklistTab = false;
        break;
    }
  }

}
