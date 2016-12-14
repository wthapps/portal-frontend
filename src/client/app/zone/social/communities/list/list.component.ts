import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiBaseServiceV2 } from '../../../../shared/services/apibase.service.v2';
import { UserService } from '../../../../shared/services/user.service';
import { LoadingService } from '../../../../partials/loading/loading.service';

import { ZSocialCommunityFormEditComponent } from '../form/edit.component';
import { ZSocialCommunityFormPreferenceComponent } from '../form/preferences.component';
import { ConfirmationService } from 'primeng/components/common/api';
import { ToastsService } from '../../../../partials/toast/toast-message.service';
import { ZoneReportService } from '../../../shared/form/report/report.service';
import { SocialService } from '../../services/social.service';

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
  favourite: any;


  constructor(private apiBaseServiceV2: ApiBaseServiceV2,
              private loadingService: LoadingService,
              private confirmationService: ConfirmationService,
              private toastsService: ToastsService,
              private zoneReportService: ZoneReportService,
              private socialService: SocialService,
              private userService: UserService) {
  }

  ngOnInit() {
    this.getList();
  }

  getList() {
    this.loadingService.start('#communites-list');
    let myuuid = this.userService.profile.uuid;
    var _this = this;

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
      message: `Are you sure to delete the community ${item.name}`,
      header: 'Delete Community',
      accept: () => {
        this.loadingService.start();
        this.apiBaseServiceV2.delete(`zone/social_network/communities/${item.uuid}`)
          .subscribe((response: any) => {
              // console.log(response);
              this.onUpdated(response.data);
              this.toastsService.success('Your community has been deleted successfully');
              this.loadingService.stop();
            },
            error => {
              // console.log(error);
              this.toastsService.danger(error);
              this.loadingService.stop();
            }
          );
      }
    });

    return false;
  }

  onLeave(item: any) {

    this.confirmationService.confirm({
      message: this.userService.profile.uuid == item.admin.uuid ?
        `You are managing the community ${item.name}. This community would be deleted permanently. Are you sure to leave?` :
        `Are you sure to leave the community ${item.name}?`,
      header: 'Leave Community',
      accept: () => {
        this.loadingService.start();
        this.apiBaseServiceV2.post(`zone/social_network/communities/leave`, JSON.stringify({uuid: item.uuid}))
          .subscribe((response: any) => {
              this.getList();
              this.toastsService.success(`You left the community ${item.name} successfully`);
              this.loadingService.stop();
            },
            error => {
              this.toastsService.danger(error);
              this.loadingService.stop();
            }
          );
      }
    });

    return false;
  }

  onPreference(item: any): any {
    this.modalPreference.modal.open();
    this.currentItem = item;
    return false;
  }

  onUpdated(item: any) {
    if (item) {
      this.getList();
    }
  }

  onReport(uuid: any): any {
    this.zoneReportService.community(uuid);
    return false;
  }


  addFavourite(uuid: any) {
    this.socialService.user.addFavourites(uuid, 'community').subscribe(
      (res: any) => {

      }
    );
  }

  getFavourite(uuid: any) {
    this.socialService.user.getFavourite(uuid, 'community').subscribe(
      (res: any) => {
        this.favourite = res.data;
      }
    );
  }
}
