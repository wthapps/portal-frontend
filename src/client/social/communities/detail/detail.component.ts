import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ZoneReportService } from '../../shared/form/report/report.service';
import { ConfirmationService } from 'primeng/components/common/api';
import { ZSocialCommunityFormEditComponent } from '../shared/form/edit.component';
import { ZSocialCommunityFormPreferenceComponent } from '../shared/form/preferences.component';
import { ApiBaseService } from '../../../core/shared/services/apibase.service';
import { UserService } from '../../../core/shared/services/user.service';
import { ToastsService } from '../../../core/partials/toast/toast-message.service';
import { SocialService } from '../../shared/services/social.service';
import { MemberListInviteComponent } from '../member/member-list-invite.component';
import { Constants } from '../../../core/shared/config/constants';
import { LoadingService } from '../../../core/partials/loading/loading.service';

declare  let _: any;
declare  let $: any;

@Component({
  moduleId: module.id,
  selector: 'z-social-community-detail',
  templateUrl: 'detail.component.html'
})


export class ZSocialCommunityDetailComponent implements OnInit{
  errorMessage: string = '';

  tab: any = {
    post: 'post',
    about: 'about',
    members: 'members',
    invitations: 'invitations',
    joinRequests: 'join_requests',
    blacklist: 'blacklist'
  };
  selectedTab: string = 'post';

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
  @ViewChild('users') users: MemberListInviteComponent;
  // @ViewChild('posts') postList: PostListComponent;



  constructor(private apiBaseService: ApiBaseService,
              private route: ActivatedRoute,
              private router: Router,
              private userService: UserService,
              private confirmationService: ConfirmationService,
              private loadingService: LoadingService,
              private toastsService: ToastsService,
              private zoneReportService: ZoneReportService,
              private socialService: SocialService) {
  }

  ngOnInit() {
    // this.postList.type = 'community';
    this.route.params.subscribe(params => {
      this.uuid = params['id'];
      this.getCommunity(this.uuid);
      this.checkCurrentUser(this.uuid);

    });

    this.route.queryParams.subscribe(
      (queryParams: any) => {
        this.selectedTab = queryParams['tab'];
        this.setTabVisibility();
        if (this.selectedTab !== undefined)
          this.getTabItems(this.uuid, this.selectedTab);
        // this.isMember = true; // testing
      }
    );

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

    this.confirmationService.confirm({
      message: this.userService.profile.uuid == this.item.admin.uuid ?
        `You are managing the community ${this.item.name}. This community would be deleted permanently. Are you sure to leave?` :
        `Are you sure to leave the community ${this.item.name}?`,
      header: 'Leave Community',
      accept: () => {
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
    });

    return false;
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
    this.socialService.community.cancelJoinRequest(this.uuid,joinRequestId).subscribe(
      (res: any)=> {
        // this.invitation = undefined;
        console.log('cancel join request: ' + joinRequestId);
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
        $('#invitation_'+this.invitationId).remove();
        // this.invitation = undefined;
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
        $('#invitation_'+this.invitationId).remove();
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
            $('#user_'+user.uuid).remove();
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
        this.apiBaseService.put(`${this.communitiesUrl}/${this.uuid}/make_admin/${user.uuid}`).subscribe(
          (res: any)=> {
            this.toastsService.success(`You have changed ${this.user ? this.user.name : ''} role to ADMIN successfully`);
            $('#user_'+user.uuid).find('span.member-role').text('Admin');
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

  chooseMembers() {
    this.users.open({url: `/zone/social_network/users/users_not_in_community/${this.uuid}`});

  }

  inviteMembers(response: any) {
    let user_ids = _.map(response.items, 'uuid');
    this.socialService.community.inviteMembers(this.uuid, user_ids)
      .subscribe((result: any) => {
          console.log('invited friends');
          this.getTabItems(this.uuid, this.selectedTab);
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
        if(res.data.invitationId)
          this.invitationId = res.data.invitationId;
        if(res.data.joinRequestId)
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
    if(tabName === undefined)
      return;
    // this.apiBaseService.get(`${this.soCommunitiesUrl}/${uuid}/${tabName}`).subscribe(
    this.socialService.community.getTabItems(uuid, tabName).subscribe(
      (res: any)=> {
        this.tabItems = res.data;


        // console.log(this.tabItems);
        // users = _.map(this.tabItems, "user");
        // console.log(users);

        // this.item = res.data;
        // this.isAdmin = this.userService.profile.uuid == this.item.admin.uuid ? true : false;
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
