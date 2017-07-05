import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';

import { LoadingService } from '../../../core/partials/loading/loading.service';
import { SocialService } from '../../shared/services/social.service';
import { UserService } from '../../../core/shared/services/user.service';
import { ZSocialCommunityFormPreferenceComponent } from '../shared/form/preferences.component';
import { Constants } from '../../../core/shared/config/constants';
import { ZSocialShareCommunityFormEditComponent } from '../../shared/form/edit-community.component';
import { Subject } from 'rxjs/Subject';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-social-community-list',
  templateUrl: 'list.component.html'
})

export class ZSocialCommunityListComponent implements OnInit, OnDestroy {
  @ViewChild('modalEdit') modalEdit: ZSocialShareCommunityFormEditComponent;
  @ViewChild('modalPreference') modalPreference: ZSocialCommunityFormPreferenceComponent;

  errorMessage: string = '';
  myList: any = [];
  list: any = [];
  currentItem: any = null;
  action: string = 'create';
  favourite: any;
  readonly communitiesUrl: string = '/' + Constants.urls.communities;
  // readonly soCommunitiesUrl: string = '/' + Constants.urls.zoneSoCommunities;

  constructor(private loadingService: LoadingService,
              private socialService: SocialService,
              private userService: UserService) {
  }

  ngOnInit() {
    this.getList();
  }

  ngOnDestroy() {
  }

  getList() {
    this.loadingService.start('#communites-list');

    let myuuid = this.userService.profile.uuid;
    // var _this_community = this;

    this.socialService.community.getCommunitiesList().toPromise()
      .then(
      (res: any)=> {
        this.myList.length = 0;
        this.list.length = 0;
        _.map(res.data, (v: any)=> {
          if (v.admin.uuid == myuuid) {
            this.myList.push(v);
          } else {
            this.list.push(v);
          }
        });
        this.loadingService.stop('#communites-list');
      },
      (error: any) => {
        this.errorMessage = <any>error;
        this.loadingService.stop('#communites-list');
      }
    );
  }

  onCreate() {
    this.modalEdit.onOpenModal();
    return false;
  }

  onActionsCreate(data: any) {
    this.myList.push(data);
  }
}
