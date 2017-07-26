import { Injectable, OnInit } from '@angular/core';

import { ApiBaseService } from '../../../core/shared/services/apibase.service';
import { Constants } from '../../../core/shared/config/constants';
import { ConfirmationService } from 'primeng/components/common/api';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../../../core/shared/services/user.service';
import { LoadingService } from '../../../core/shared/components/loading/loading.service';
import { ToastsService } from '../../../core/shared/components/toast/toast-message.service';

declare let _: any;
/**
 *
 */
@Injectable()
export class SoCommunityService  {
  static readonly MEMBER_ROLE = { Admin: 'Admin' ,
    Member: 'Member'
  } ;

  readonly soCommunitiesUrl: string = Constants.urls.zoneSoCommunities;
  readonly soUsersUrl: string = Constants.urls.zoneSoUsers;
  readonly soInvitationsUrl: string = Constants.urls.zoneSoInvitations;
  readonly soFavouritesUrl: string = Constants.urls.zoneSoFavourites;
  readonly soNotificationsUrl: string = Constants.urls.zoneSoNotifications;
  readonly soReportList: string = Constants.urls.zoneSoReportList;
  currentCommunity: any;

  constructor(private apiBaseService: ApiBaseService,
              private router: Router,
              private userService: UserService,
              private loadingService: LoadingService,
              private toastsService: ToastsService,
              private confirmationService: ConfirmationService  ) {
  }


  getCommunitiesList() {
    return this.apiBaseService.get(this.soCommunitiesUrl);
  }

  deleteCommunity(uuid: string) {
    return this.apiBaseService.delete(`${this.soCommunitiesUrl}/${uuid}`);
  }

  leaveCommunity(uuid: string): Observable<any> {
    return this.apiBaseService.post(`${this.soCommunitiesUrl}/leave`, JSON.stringify({uuid: uuid}));
  }


  confirmLeaveCommunity(community: any): Promise<any> {
    let enoughAdmins = community.admin_count > 1 ? true : false;

    let pickAnotherAdmin = _.find(community.admins, (a: any) => a.id == this.userService.profile.id) != undefined  && !enoughAdmins;

    return new Promise<any>((resolve, reject) => {
      this.confirmationService.confirm({
        message: pickAnotherAdmin ?
          `Hi there, you need to pick another admin for the community ${community.name} before leaving.` :
          `Are you sure to leave the community ${community.name}?`,
        header: 'Leave Community',
        accept: () => {
          if (pickAnotherAdmin) {
            // Navigate to member tab
            this.router.navigate(['/', Constants.urls.communities, community.uuid], { queryParams: {tab: 'members', skipLocationChange: true }});
          } else {
            this.loadingService.start();
            this.leaveCommunity(community.uuid)
              .toPromise()
              .then(() => {
              this.loadingService.stop();
              resolve(community); })
              .catch((error: any) => {
                reject(error);
                this.toastsService.danger(error);
                this.loadingService.stop();
            });
          }
        }
      });
    });
  }

  confirmDeleteCommunity(community: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.confirmationService.confirm({
        message: `Are you sure to delete the community ${community.name}`,
        header: 'Delete Community',
        accept: () => {
          this.loadingService.start();
          this.deleteCommunity(`${community.uuid}`)
            .toPromise()
            .then(() => {
                  resolve(community);
                  this.toastsService.success(`Your community - ${community.name} - has been deleted successfully`);
                  this.loadingService.stop();})
            .catch((error: any) => {
                  reject(error);
                  this.toastsService.danger(error);
                  this.loadingService.stop();
              });
        }
      });
    });
  }

  toggleComNotification(uuid: string) {
    return this.apiBaseService.post(`${this.soCommunitiesUrl}/toggle_com_notification`, {uuid: uuid});
  }

  getUserSettings(uuid: string) {
    return this.apiBaseService.get(`${this.soCommunitiesUrl}/${uuid}/get_user_settings`);
  }

  askToJoin(uuid: string) {
    return this.apiBaseService.post(`${this.soCommunitiesUrl}/${uuid}/invitations`);
  }

  cancelJoinRequest(uuid: string, joinRequestId: string) {
    return this.apiBaseService.delete(`${this.soCommunitiesUrl}/${uuid}/invitations/${joinRequestId}`);
  }

  cancelInvitation(uuid:string, invitationId: string) {
    return this.apiBaseService.delete(`${this.soCommunitiesUrl}/${uuid}/invitations/${invitationId}`);
  }

  acceptJoinRequest(uuid: string, user_id: string) {
    return this.apiBaseService.post(`${this.soCommunitiesUrl}/accept_join_request/`,
      JSON.stringify({uuid: uuid, user_id: user_id}));
  }

  deleteMember(communityUuid: string, userUuid: string) {
    return this.apiBaseService.delete(`${this.soCommunitiesUrl}/${communityUuid}/members/${userUuid}`);
  }

  makeAdmin(communityUuid: string, userUuid: string) {
    return this.apiBaseService.post(`${this.soCommunitiesUrl}/${communityUuid}/make_admin/${userUuid}`);
  }

  inviteMembers(communityUuid: string, user_ids: any) {
    return this.apiBaseService.post(`${this.soCommunitiesUrl}/invite`, JSON.stringify({
      uuid: communityUuid,
      user_ids: user_ids
    }));
  }

  onReportMember(reportee_id: string, communityUuid: string, reason: string = '') {
    return this.apiBaseService.post(this.soReportList, JSON.stringify({
      reportee_id: reportee_id,
      community_uuid: communityUuid,
      reason: reason
    }));
  }

  getCommunity(uuid: string) {
    return this.apiBaseService.get(`${this.soCommunitiesUrl}/${uuid}`).take(1);
  }



  checkCurrentUser(uuid: string) {
    return this.apiBaseService.get(`${this.soCommunitiesUrl}/${uuid}/check_current_user/`);
  }

  getTabItems(uuid: string, tabName: string) {
    return this.apiBaseService.get(`${this.soCommunitiesUrl}/${uuid}/${tabName}`);
  }

  checkJoinRequestStatus(uuid: string) {
    return this.apiBaseService.get(`${this.soCommunitiesUrl}/${uuid}/join_request_status`);
  }

  createCommunity(body: any) {
    return this.apiBaseService.post(`${this.soCommunitiesUrl}`, body);
  }

  updateCommunity(uuid: string, body: any) {
    return this.apiBaseService.put(`${this.soCommunitiesUrl}/${uuid}`, body);
  }

  resetSettings(uuid:string ) {
    return this.apiBaseService.put(`${this.soCommunitiesUrl}/${uuid}/reset_settings`);
  }
}

