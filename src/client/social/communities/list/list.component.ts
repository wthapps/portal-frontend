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
import { ZSocialCommunityFormPreferenceComponent } from '../shared/form/preferences.component';
import { Constants } from '../../../core/shared/config/constants';
import { Router } from '@angular/router';
import { ZoneReportService } from '../../../core/shared/form/report/report.service';
import { SocialFavoriteService } from '../../shared/services/social-favorites.service';

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
              // private communityService: SoCommunityService,
              private favoriteService: SocialFavoriteService,
              private userService: UserService) {
  }

  ngOnInit() {
    this.getList();
  }

  getList() {
    this.loadingService.start('#communites-list');

    let myuuid = this.userService.profile.uuid;
    var _this_community = this;

    this.socialService.community.getCommunitiesList().take(1).subscribe(
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
      (error: any) => {
        this.errorMessage = <any>error
        this.loadingService.stop('#communites-list');
      }
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
    this.socialService.community.confirmDeleteCommunity(item)
      .then((community: any) => _.remove(this.myList, (c: any) => c.uuid == community.uuid));
  }

  confirmLeaveCommunity(community: any) {
    this.socialService.community.confirmLeaveCommunity(community)
      .then((community: any) => {
        // Remove leaved community in both myList and list just to make sure
        _.remove(this.list, (c: any) => c.uuid === community.uuid);
        _.remove(this.myList, (c: any) => c.uuid === community.uuid);
      })
      .catch((error: any) => console.error('confirm leave community error: ', error));
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
    this.favoriteService.addFavourite(uuid, 'community', this.favourite);
  }

  getFavourite(uuid: any) {
    this.socialService.user.getFavourite(uuid, 'community').subscribe(
      (res: any) => {
        this.favourite = res.data;
      }
    );
  }
}
