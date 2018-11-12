import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { ApiBaseService, UserService } from '@wth/shared/services';
import { LoadingService } from '@wth/shared/shared/components/loading/loading.service';
import { ToastsService } from '@wth/shared/shared/components/toast/toast-message.service';
import { WthConfirmService } from '@wth/shared/shared/components/confirmation/wth-confirm.service';
import { Constants } from '@wth/shared/constant';
import { SHORTCUTS_REMOVE_DONE } from '../reducers/index';
import { Store } from '@ngrx/store';

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
  readonly soReportList: string = Constants.urls.zoneSoReportList;
  currentCommunity: any;

  constructor(private apiBaseService: ApiBaseService,
              private router: Router,
              private userService: UserService,
              private loadingService: LoadingService,
              private store: Store<any>,
              private toastsService: ToastsService,
              private wthConfirmService: WthConfirmService ) {
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
    let enoughAdmins = community.admin_count > 1;

    let pickAnotherAdmin = community.admins.some((a: any) => a.id == this.userService.getSyncProfile().id)  && !enoughAdmins && (community.user_count > 1);

    return new Promise<any>((resolve, reject) => {
      this.wthConfirmService.confirm({
        acceptLabel: 'OK',
        message: pickAnotherAdmin ?
          `Hi there, you need to pick another admin for the community ${community.name} before leaving.` :
          `Are you sure to leave the community ${community.name} ?`,
        header: 'Leave Community',
        accept: () => {
          if (pickAnotherAdmin) {
            // Navigate to member tab
            this.router.navigate(['/', Constants.urls.communities, community.uuid], { queryParams: {tab: 'members', skipLocationChange: true }});
          } else {
            this.loadingService.start();
            this.leaveCommunity(community.uuid)
              .toPromise()
              .then((res) => {
                this.loadingService.stop();
                if(res.shortcut_id)
                  this.store.dispatch({type: SHORTCUTS_REMOVE_DONE, payload: [res.shortcut_id]});
                resolve(community);
              })
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
      this.wthConfirmService.confirm({
        acceptLabel: 'OK',
        message: `Are you sure to delete the community ${community.name}`,
        header: 'Delete Community',
        accept: () => {
          this.loadingService.start();
          this.deleteCommunity(`${community.uuid}`)
            .toPromise()
            .then((res) => {
                  resolve(community);
                  this.toastsService.success(`Your community - ${community.name} - has been deleted successfully`);
                  this.loadingService.stop();
                  if(res.shortcut_id)
                    this.store.dispatch({type: SHORTCUTS_REMOVE_DONE, payload: [res.shortcut_id]});
          })
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
    return this.apiBaseService.get(`${this.soCommunitiesUrl}/${uuid}`).pipe(take(1));
  }

  getTabItems(uuid: string, tabName: string) {
    return this.apiBaseService.get(`${this.soCommunitiesUrl}/${uuid}/${tabName}`);
  }

  createCommunity(body: any) {
    return this.apiBaseService.post(`${this.soCommunitiesUrl}`, body);
  }

  updateCommunity(uuid: string, body: any) {
    return this.apiBaseService.put(`${this.soCommunitiesUrl}/${uuid}`, body);
  }

  resetSettings(uuid: string ) {
    return this.apiBaseService.put(`${this.soCommunitiesUrl}/${uuid}/reset_settings`);
  }
}

