import {Injectable, OnInit} from '@angular/core';

import { ApiBaseService } from '../../../core/shared/services/apibase.service';
import {Constants} from "../../../core/shared/config/constants";
/**
 *
 */
@Injectable()
export class SoCommunityService implements OnInit {
  static readonly MEMBER_ROLE = { Admin: "Admin" ,
    Member: "Member"
  } ;

  soCommunitiesUrl: string = Constants.urls.zoneSoCommunities;
  soUsersUrl: string = Constants.urls.zoneSoUsers;
  soInvitationsUrl: string = Constants.urls.zoneSoInvitations;
  soFavouritesUrl: string = Constants.urls.zoneSoFavourites;
  soNotificationsUrl: string = Constants.urls.zoneSoNotifications;
  soReportList: string = Constants.urls.zoneSoReportList;

  constructor(private apiBaseService: ApiBaseService  ) {
  }


  ngOnInit() {
  }


  getCommunitiesList() {
    console.log("soCommunitiesUrl: " + this.soCommunitiesUrl);
    return this.apiBaseService.get(this.soCommunitiesUrl);
  }

  deleteCommunity(uuid: string) {
    return this.apiBaseService.delete(`$this.communitiesUrl}/${uuid}`);
  }

  leaveCommunity(uuid: string) {
    return this.apiBaseService.post(`${this.soCommunitiesUrl}/leave`, JSON.stringify({uuid: uuid}));
  }

//

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
    return this.apiBaseService.put(`${this.soCommunitiesUrl}/${communityUuid}/make_admin/${userUuid}`);
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
    return this.apiBaseService.get(`${this.soCommunitiesUrl}/${uuid}`);
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
}

