import { Component, ViewChild, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { ApiBaseServiceV2 } from '../../../../shared/services/apibase.service.v2';
import { LoadingService } from '../../../../partials/loading/loading.service';

import { ListInviteMembersComponent } from '../../post/list-invite-members.component';
import { ApiBaseService } from '../../../../shared/index';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-social-community-detail-members',
  templateUrl: 'members.component.html'
})

export class ZSocialCommunityDetailMembersComponent implements OnInit {
  @ViewChild('users') users: ListInviteMembersComponent;

  errorMessage: string = '';
  data: any = [];
  uuid: string = '';

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

  chooseMembers() {
    this.users.open({url: `zone/social_network/users/users_not_in_community/${this.uuid}`});
  }

  inviteMembers(response: any) {
    this.api.post(`zone/social_network/communities/invite`, JSON.stringify({
      community_id: this.uuid,
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
