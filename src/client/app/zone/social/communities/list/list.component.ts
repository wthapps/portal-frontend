import { Component, OnInit } from '@angular/core';
import { ApiBaseServiceV2 } from '../../../../shared/services/apibase.service.v2';
import { UserService } from '../../../../shared/services/user.service';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-social-community-list',
  templateUrl: 'list.component.html'
})

export class ZSocialCommunityListComponent implements OnInit {

  errorMessage: string = '';
  myList: any = [];
  list: any = [];

  constructor(private apiBaseServiceV2: ApiBaseServiceV2,
              private userService: UserService) {
  }

  ngOnInit() {
    let myuuid = this.userService.profile.uuid;
    let _this = this;
    this.apiBaseServiceV2.get('zone/social_network/communities').subscribe(
      (res: any)=> {
        _.map(res.data, (v: any)=> {
          if (v.admin.uuid == myuuid) {
            _this.myList.push(v);
          } else {
            _this.list.push(v);
          }
        });
      },
      error => this.errorMessage = <any>error
    );
  }
}
