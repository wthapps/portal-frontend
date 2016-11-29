import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiBaseServiceV2 } from '../../../../shared/services/apibase.service.v2';
import { UserService } from '../../../../shared/services/user.service';
import { LoadingService } from '../../../../partials/loading/loading.service';

import { ZSocialCommunityFormEditComponent } from '../form/edit.component';
import { ZSocialCommunityFormPreferenceComponent } from '../form/preferences.component';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-social-community-list',
  templateUrl: 'list.component.html'
})

export class ZSocialCommunityListComponent implements OnInit {

  @ViewChild('modalEdit') modalEdit: ZSocialCommunityFormEditComponent;
  @ViewChild('modalPreference') modalPreference: ZSocialCommunityFormPreferenceComponent;

  errorMessage: string = '';
  myList: any = [];
  list: any = [];
  currentItem: string = '';


  constructor(private apiBaseServiceV2: ApiBaseServiceV2,
              private loadingService: LoadingService,
              private userService: UserService) {
  }

  ngOnInit() {
    this.getList();
  }

  getList() {
    this.loadingService.start('#communites-list');
    let myuuid = this.userService.profile.uuid;
    let _this = this;

    this.apiBaseServiceV2.get('zone/social_network/communities').subscribe(
      (res: any)=> {
        _this.myList.length = 0;
        _this.list.length = 0;
        _.map(res.data, (v: any)=> {
          if (v.admin.uuid == myuuid) {
            _this.myList.push(v);
          } else {
            _this.list.push(v);
          }
        });
        this.loadingService.stop('#communites-list');
      },
      error => this.errorMessage = <any>error
    );
  }

  onEdit(item: any) {
    this.modalEdit.modal.open();
    this.currentItem = item;
    return false;
  }

  onPreference(item: any) {
    this.modalPreference.modal.open();
    this.currentItem = item;
    return false;
  }

  onUpdated(item: any) {
    if (item) {
      this.getList();
    }
  }

}
