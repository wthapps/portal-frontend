import { Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ListInviteMembersComponent } from '../../post/list-invite-members.component';
import { ApiBaseService } from '../../../../shared/index';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-social-community-detail-members',
  templateUrl: 'members.component.html'
})

export class ZSocialCommunityDetailMembersComponent implements OnInit{
  @ViewChild('users') users: ListInviteMembersComponent;

  id:string ='';

  constructor(private route: ActivatedRoute, private api: ApiBaseService) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });
  }

  chooseMembers() {
    this.users.open({url: `zone/social_network/users/users_not_in_community/${this.id}`});
  }

  inviteMembers(response: any) {
    this.api.post(`zone/social_network/communities/invite`, JSON.stringify({community_id: this.id, user_ids: _.map(response.items,'uuid')}))
      .map(res => res.json)
      .subscribe((result: any) => {
        console.log('invited friends');
      },
      error => {
        console.log('error', error);
      });
  }

}
