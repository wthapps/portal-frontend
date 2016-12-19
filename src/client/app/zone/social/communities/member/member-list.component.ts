import { Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ApiBaseService } from '../../../../shared/services/apibase.service';
import { LoadingService } from '../../../../partials/loading/loading.service';

import { MemberListInviteComponent } from './member-list-invite.component';
import { ApiBaseService, ToastsService, ConfirmationService } from '../../../../shared/index';
import { ZoneReportService } from '../../../shared/form/report/report.service';


declare var _: any;
/**
 * selector: com stands for community.
 */

@Component({
  moduleId: module.id,
  selector: 'com-member-list',
  templateUrl: 'member-list.component.html'
})

export class ComMemberListComponent implements OnInit {
  @ViewChild('users') users: MemberListInviteComponent;

  errorMessage: string = '';
  data: any = [];
  uuid: string = '';
  uuidUser: string = '';
  selectedTab: string;
  items: Array<any> = new Array<any>(); // this store member, invitations, join requests and blacklist

  constructor(private api: ApiBaseService,
              private apiBaseService: ApiBaseService,
              private loadingService: LoadingService,
              private zoneReportService: ZoneReportService,
              private route: ActivatedRoute,
              private router: Router,
              private confirmationService: ConfirmationService,
              private toastsService: ToastsService) {
  }

  ngOnInit() {
    // this.loadingService.start('.zone-social-cover');
    this.route.params.subscribe(params => {
      this.uuid = params['id'];
      this.apiBaseService.get(`zone/social_network/communities/${params['id']}`).subscribe(
        (res: any)=> {
          this.data = res.data;
          // this.loadingService.stop('.zone-social-cover');
        },
        error => {
          // this.loadingService.stop('.zone-social-cover');
          this.errorMessage = <any>error;
        }
      );

      this.route.queryParams.subscribe(
        (queryParams: any) => {
          this.selectedTab = queryParams['tab'] == undefined ? 'members' : queryParams['tab'];
          this.loadDataBySelectedTab();
        }
      );
    });

  }

  onReportMember(uuid: string): any {
    this.zoneReportService.member(uuid);
    this.uuidUser = uuid;
    return false;
  }

  chooseMembers() {
    this.users.open({url: `zone/social_network/users/users_not_in_community/${this.uuid}`});
  }

  inviteMembers(response: any) {
    this.api.post(`zone/social_network/communities/invite`, JSON.stringify({
      uuid: this.uuid,
      user_ids: _.map(response.items, 'uuid')
    }))
      .subscribe((result: any) => {
          console.log('invited friends');
        },
        error => {
          console.log('error', error);
        });
  }

  viewMember(data: any) {
    this.router.navigate([`/zone/social/communities/${this.uuid}/members`], {queryParams: {tab: this.selectedTab}});
    this.loadDataBySelectedTab();
  }

  loadDataBySelectedTab() {
    if (this.selectedTab == 'members') return;
    this.apiBaseService.get(`zone/social_network/communities/${this.uuid}/${this.selectedTab}`).subscribe(
      (res: any)=> {
        this.items = res.data;
        console.log('response ', res.data);
      },
      error => {
        // this.loadingService.stop('.zone-social-cover');
        this.errorMessage = <any>error;
      }
    );
  }

  acceptJoinRequest(item: any) {
    this.apiBaseService.post(`zone/social_network/communities/accept_join_request/`,
      JSON.stringify({uuid: this.uuid, user_id: item.inviter.uuid})).subscribe(
      (res: any)=> {
        this.loadDataBySelectedTab();
      },
      error => {
        // this.loadingService.stop('.zone-social-cover');
        this.errorMessage = <any>error;
      }
    );
  }

  cancelInvitation(id: any) {
    this.apiBaseService.delete(`zone/social_network/communities/cancel_invitation/${id}`).subscribe(
      (res: any)=> {
        this.loadDataBySelectedTab();
      },
      error => {
        // this.loadingService.stop('.zone-social-cover');
        this.errorMessage = <any>error;
      }
    );
  }

  deleteMember(user: any) {
    this.confirmationService.confirm({
      message: `Are you sure to delete member ${user.name} from the community?`,
      header: 'Delete Member',
      accept: () => {
        this.apiBaseService.delete(`zone/social_network/communities/${this.uuid}/members/${user.uuid}`).subscribe(
          (res: any)=> {
            this.toastsService.success('You deleted member successfully');

            this.loadDataBySelectedTab();
          },
          error => {
            this.toastsService.danger(error);
            this.loadingService.stop();
          }
        );
      }
    });
  }
}
