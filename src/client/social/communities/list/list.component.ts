import { Component, OnInit, ViewChild } from '@angular/core';
// import { ApiBaseService } from '../../../../shared/services/apibase.service';
// import { UserService } from '../../../../shared/services/user.service';
// import { LoadingService } from '../../../../partials/loading/loading.service';
//
// import { ZSocialCommunityFormEditComponent } from '../form/edit.component';
// import { ZSocialCommunityFormPreferenceComponent } from '../form/preferences.component';
import { ConfirmationService } from 'primeng/components/common/api';
import { ApiBaseService } from '../../../core/shared/services/apibase.service';
import { LoadingService } from '../../../core/partials/loading/loading.service';
import { ZSocialCommunityFormEditComponent } from '../shared/form/edit.component';
import { SocialService } from '../../shared/services/social.service';
import { ToastsService } from '../../../core/partials/toast/toast-message.service';
import { UserService } from '../../../core/shared/services/user.service';
import { ZoneReportService } from '../../shared/form/report/report.service';
import { ZSocialCommunityFormPreferenceComponent } from '../shared/form/preferences.component';
import { Constants } from '../../../core/shared/config/constants';
import { Router } from '@angular/router';

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
  readonly communitiesUrl: string = '/' + Constants.urls.communities;
  // readonly soCommunitiesUrl: string = '/' + Constants.urls.zoneSoCommunities;

  constructor(private apiBaseService: ApiBaseService,
              private loadingService: LoadingService,
              private confirmationService: ConfirmationService,
              private toastsService: ToastsService,
              private zoneReportService: ZoneReportService,
              private socialService: SocialService,
              private router: Router,
              // private communityService: SoCommunityService,
              private userService: UserService) {
  }

  ngOnInit() {
    this.getList();
  }

  getList() {
    this.loadingService.start('#communites-list');

    let myuuid = this.userService.profile.uuid;
    var _this_community = this;

    this.socialService.community.getCommunitiesList().subscribe(
      (res: any)=> {
        _this_community.myList.length = 0;
        _this_community.list.length = 0;
        _.map(res.data, (v: any)=> {
          if (v.admin.uuid == myuuid) {
            _this_community.myList.push(v);
          } else {
            _this_community.list.push(v);
          }
        });
        this.loadingService.stop('#communites-list');
      },
      error => this.errorMessage = <any>error
    );
  }

  onCreate() {
    this.modalEdit.resetFormInputs();
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
        // this.apiBaseService.delete(`$this.communitiesUrl}/${item.uuid}`)
        this.socialService.community.deleteCommunity(`${item.uuid}`)
          .subscribe((response: any) => {
              // console.log(response);
              this.onUpdated(response.data);
              this.toastsService.success(`Your community - ${item.name} - has been deleted successfully`);
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

    // this.confirmationService.confirm({
    //   message: this.userService.profile.uuid == item.admin.uuid ?
    //     `You are managing the community ${item.name}. This community would be deleted permanently. Are you sure to leave?` :
    //     `Are you sure to leave the community ${item.name}?`,
    //   header: 'Leave Community',
    //   accept: () => {
    //     this.loadingService.start();
    //     // this.apiBaseService.post(`${this.soCommunitiesUrl}/leave`, JSON.stringify({uuid: item.uuid}))
    //     this.socialService.community.leaveCommunity(item.uuid)
    //       .subscribe((response: any) => {
    //           this.getList();
    //           this.toastsService.success(`You left the community ${item.name} successfully`);
    //           this.loadingService.stop();
    //         },
    //         error => {
    //           this.toastsService.danger(error);
    //           this.loadingService.stop();
    //         }
    //       );
    //   }
    // });
    //
    // return false;

    let enoughAdmins = item['admin_count'] > 1 ? true : false;
    let pickAnotherAdmin = this.userService.profile.uuid == item.admin.uuid && !enoughAdmins;

    this.confirmationService.confirm({
      message: pickAnotherAdmin ?
        `Hi there, you need to pick another admin for the community ${item.name} before leaving.` :
        `Are you sure to leave the community ${item.name}?`,
      header: 'Leave Community',
      accept: () => {
        if (pickAnotherAdmin) {
          // Navigate to member tabteryParams: {tab: 'members', skipLocationChange: true }});
          this.router.navigate([this.communitiesUrl, item.uuid], { queryParams: {tab: 'members', skipLocationChange: true }});
        } else {
          this.leaveCommunity(item);
        }
      }
    });

    return false;
  }


  leaveCommunity(item: any) {
    this.loadingService.start();
    this.socialService.community.leaveCommunity(item.uuid)
      .subscribe((response: any) => {
          this.loadingService.stop();
          // this.router.navigateByUrl(this.communitiesUrl);
          _.remove(this.list, (c: any) => c.uuid == item.uuid);
        },
        error => {
          this.toastsService.danger(error);
          this.loadingService.stop();
        }
      );
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
    this.socialService.user.toggleFavourites(uuid, 'community').subscribe(
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
