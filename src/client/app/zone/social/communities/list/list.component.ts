import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiBaseServiceV2 } from '../../../../shared/services/apibase.service.v2';
import { UserService } from '../../../../shared/services/user.service';
import { LoadingService } from '../../../../partials/loading/loading.service';

import { ZSocialCommunityFormEditComponent } from '../form/edit.component';
import { ZSocialCommunityFormPreferenceComponent } from '../form/preferences.component';
import { ConfirmationService } from 'primeng/components/common/api';
import { ToastsService } from '../../../../partials/toast/toast-message.service';

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
  currentItem: any = null;
  action: string = 'create';


  constructor(private apiBaseServiceV2: ApiBaseServiceV2,
              private loadingService: LoadingService,
              private confirmationService: ConfirmationService,
              private toastsService: ToastsService,
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
        console.log(res);
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

  onCreate() {
    this.modalEdit.modal.open();
    this.action = 'create';
    return false;
  }

  onEdit(item: any) {
    this.modalEdit.modal.open();
    this.currentItem = item;
    this.action = 'edit';
    return false;
  }

  onDelete(item: any) {
    console.log(item);
    this.confirmationService.confirm({
      message: '',
      header: 'Delete Account',
      accept: () => {
        this.loadingService.start();
        this.apiBaseServiceV2.delete(`zone/social_network/communities/${item.uuid}`)
          .subscribe((response: any) => {
              console.log(response);
              this.onUpdated(response.data);
              this.toastsService.success(response.message);
              this.loadingService.stop();
            },
            error => {
              console.log(error);
              this.toastsService.danger(error);
              this.loadingService.stop();
            }
          );
      }
    });




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
