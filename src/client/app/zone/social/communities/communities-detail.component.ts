import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiBaseService } from '../../../shared/services/apibase.service';
import { UserService } from '../../../shared/services/user.service';
import { ZSocialCommunityFormEditComponent } from './form/edit.component';
import { MemberListInviteComponent } from './member/member-list-invite.component';
import { ZSocialCommunityFormPreferenceComponent } from './form/preferences.component';
import { SocialService } from '../services/social.service';
import { ZoneReportService } from '../../shared/form/report/report.service';
import { LoadingService } from '../../../partials/loading/loading.service';
import { ToastsService } from '../../../partials/toast/toast-message.service';
import { ConfirmationService } from 'primeng/components/common/api';



declare  var _: any;
@Component({
  moduleId: module.id,
  selector: 'z-social-community-detail',
  templateUrl: 'communities-detail.component.html'
})

export class ZSocialCommunityDetailComponent implements OnInit {
  errorMessage: string = '';

  tab: any = {
    post: 'post',
    about: 'about',
    members: 'members',
    invitations: 'invitations',
    joinRequests: 'join_requests',
    blacklist: 'blacklist'
  };
  selectedTab: string = '';

  item: any = null;
  uuid: string;
  user: any;
  invitation: any = null;
  invitationId: string;
  tabItems: Array<any> = new Array<any>();
  // users: Array<any> = [];
  isAdmin: boolean = false;
  isMember: boolean = true;
  favourite: any;

  isPostTab: boolean = true;
  isAboutTab: boolean = false;
  isMemberTab: boolean = false;
  isInvitationTab: boolean = false;
  isJoinRequestTab: boolean = false;
  isBlacklistTab: boolean = false;

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
      this.getItem(this.uuid);
      this.getIsAdmin(this.uuid);
      this.checkJoinRequestStatus(this.uuid);
    });

    this.route.queryParams.subscribe(
      (queryParams: any) => {
        this.selectedTab = queryParams['tab'];
        this.setTabVisibility();
        if (this.selectedTab != undefined)
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
      this.getItem(this.uuid);
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
        this.apiBaseService.post(`zone/social_network/communities/leave`, JSON.stringify({uuid: this.uuid}))
            .subscribe((response: any) => {
                this.loadingService.stop();
                this.router.navigateByUrl('/zone/social/communities');
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
    this.apiBaseService.post(`zone/social_network/communities/${this.uuid}/invitations`)
      .subscribe((result: any) => {
          this.invitation = result.data;
        },
        error => {
          console.log('error', error);
        });
  }

  cancelJoinRequest() {
    this.apiBaseService.delete(`zone/social_network/communities/${this.uuid}/invitations/${this.invitation.id}`).subscribe(
      (res: any)=> {
        this.invitation = undefined;
        console.log('after invitation', this.invitation);
      },
      error => {
        // this.loadingService.stop('.zone-social-cover');
        this.errorMessage = <any>error;
      }
    );
  }

  cancelInvitation(invitationId: any) {
    this.invitationId = invitationId;
    this.apiBaseService.delete(`zone/social_network/communities/${this.uuid}/invitations/${invitationId}`).subscribe(
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
    this.apiBaseService.post(`zone/social_network/communities/accept_join_request/`,
      JSON.stringify({uuid: this.uuid, user_id: item.inviter.uuid})).subscribe(
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
        this.apiBaseService.delete(`zone/social_network/communities/${this.uuid}/members/${user.uuid}`).subscribe(
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
      message: `Are you sure to change role of member ${this.user ? this.user.name : ""} to admin?`,
      header: 'Make admin',
      accept: () => {
        this.apiBaseService.put(`zone/social_network/communities/${this.uuid}/make_admin/${user.uuid}`).subscribe(
          (res: any)=> {
            this.toastsService.success('You have changed ${this.user ? this.user.name : ""} role to ADMIN successfully');
            $('#user_'+user.uuid).find("span.member-role").text("Admin");
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
    this.users.open({url: `zone/social_network/users/users_not_in_community/${this.uuid}`});

  }

  inviteMembers(response: any) {
    this.apiBaseService.post(`zone/social_network/communities/invite`, JSON.stringify({
      uuid: this.uuid,
      user_ids: _.map(response.items, 'uuid')
    }))
        .subscribe((result: any) => {
            console.log('invited friends');
            this.getTabItems(this.uuid, this.selectedTab);
            console.log('get tab items for: ' + this.selectedTab);
          },
          error => {
            console.log('error', error);
          });
  }

  private getItem(uuid: string) {
    this.apiBaseService.get(`zone/social_network/communities/${uuid}`).subscribe(
      (res: any)=> {
        this.item = res.data;

        // Check if this user is a community member
        var users = _.map(this.item.community_users, function(c) { return c.user.uuid });
        this.isMember =_.contains(users, this.userService.profile.uuid);
        // this.isAdmin = this.userService.profile.uuid == this.item.admin.uuid ? true : false;

      },
      error => {
        this.errorMessage = <any>error;
      }
    );
  }



  private getIsAdmin(uuid: string) {
    this.apiBaseService.get(`zone/social_network/communities/${uuid}/is_admin/`).subscribe(
      (res: any)=> {
        this.isAdmin = res.data;

        // this.isAdmin = this.userService.profile.uuid == this.item.admin.uuid ? true : false;

      },
      error => {
        this.errorMessage = <any>error;
      }
    );
  }

  private getTabItems(uuid: string, tabName: string) {
    this.tabItems = [];
    this.apiBaseService.get(`zone/social_network/communities/${uuid}/${tabName}`).subscribe(
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

  private checkJoinRequestStatus(uuid: string) {
    this.apiBaseService.get(`zone/social_network/communities/${uuid}/join_request_status`).subscribe(
      (result: any) => {
        this.invitation = result.data;
      },
      error => {
        console.log('error', error);
      });
  }
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
