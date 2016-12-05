import { Component, ViewChild, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { ApiBaseServiceV2 } from '../../../../shared/services/apibase.service.v2';
import { LoadingService } from '../../../../partials/loading/loading.service';

import { MemberListInviteComponent } from './member-list-invite.component';
import { ApiBaseService } from '../../../../shared/index';
import { ZPictureFormReportMemberComponent } from '../../../shared/form/report/member.component';

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

  @ViewChild('modalReportUser') modalReportUser: ZPictureFormReportMemberComponent;

  errorMessage: string = '';
  data: any = [];
  uuid: string = '';
  uuidUser: string = '';

  constructor(private api: ApiBaseService,
              private apiBaseServiceV2: ApiBaseServiceV2,
              private loadingService: LoadingService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    // this.loadingService.start('.zone-social-cover');
    this.route.params.subscribe(params => {
      this.uuid = params['id'];
      this.apiBaseServiceV2.get(`zone/social_network/communities/${params['id']}`).subscribe(
        (res: any)=> {
          this.data = res.data;
          // this.loadingService.stop('.zone-social-cover');
        },
        error => {
          // this.loadingService.stop('.zone-social-cover');
          this.errorMessage = <any>error
        }
      );
    });

  }

  onReportMember(uuid: string) {
    this.uuidUser = uuid;
    this.modalReportUser.modal.open();
  }

  chooseMembers() {
    this.users.open({url: `zone/social_network/users/users_not_in_community/${this.uuid}`});
  }

  inviteMembers(response: any) {
    this.api.post(`zone/social_network/communities/invite`, JSON.stringify({
      uuid: this.uuid,
      user_ids: _.map(response.items, 'uuid')
    }))
      .map(res => res.json)
      .subscribe((result: any) => {
          console.log('invited friends');
        },
        error => {
          console.log('error', error);
        });
  }

}
