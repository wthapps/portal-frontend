import { Component, OnInit, ViewChild } from '@angular/core';

import { BsModalComponent } from 'ng2-bs3-modal';
import { Store } from '@ngrx/store';

import { SoUser } from '@shared/shared/models';
import { WthConfirmService } from '@shared/services';
import { SocialService } from '@social/shared/services/social.service';
import { SO_PROFILE_UPDATE_DONE } from '@social/shared/reducers';
import { Constants } from '@shared/constant';

interface Privacy {
  css: string;
  text: string;
  data: string;
}
@Component({
  selector: 'z-social-shared-setting',
  templateUrl: 'settings.component.html',
  styleUrls: ['settings.component.scss']
})

export class ZSocialSharedSettingsComponent implements OnInit {
  @ViewChild('modal') modal: BsModalComponent;
  user: SoUser = new SoUser();
  loading = true;
  postPrivacies: Privacy[] = [];
  selectedPrivacy: Privacy;

  readonly PRIVACIES: string[] = ['public', 'friends', 'personal'];
  readonly PRIVACY_NAMES: any = {
    public: 'Public',
    friends: 'Friends',
    personal: 'Personal'
  };

  constructor(
    private socialService: SocialService,
    private store: Store<any>,
    private wthConfirmService: WthConfirmService
  ) {
    //
    this.postPrivacies = this.PRIVACIES.map(pr => Constants.soPostPrivacy[pr]);
  }

  ngOnInit() {
    this.loading = true;
    this.socialService.user
      .get()
      .toPromise()
      .then((res: any) => {
        this.user = new SoUser().from(res.data);
        this.setSelectedPrivacy();
        this.loading = false;
      })
      .catch(err => this.loading = false);
  }

  open() {
    this.modal.open();
  }

  updatePrivacy(event) {
    this.user.settings.viewable_post.value = this.selectedPrivacy.data;
    this.updateSettings(this.user.settings);
  }

  resetSettings() {
    this.wthConfirmService.confirm({
      acceptLabel: 'Reset',
      rejectLabel: 'Cancel',
      message: 'Are you sure you want to reset settings?',
      header: 'Reset Default',
      accept: () => {
        this.socialService.user
          .reset_setting()
          .toPromise()
          .then((res: any) => {
            this.user = new SoUser().from(res.data);
            this.setSelectedPrivacy();
            this.store.dispatch({
              type: SO_PROFILE_UPDATE_DONE,
              payload: res.data
            });
          });
      }
    });
  }

  updateSettings(settings: any) {
    this.socialService.user
      .update({ settings })
      .subscribe((res: any) => {
        this.user = new SoUser().from(res.data);
        this.store.dispatch({
          type: SO_PROFILE_UPDATE_DONE,
          payload: res.data
        });
      });
  }

  cancel() {
    this.modal.close();
  }

  save() {
    this.updateSettings(this.user.settings);
    this.modal.close();
  }

  private setSelectedPrivacy() {
    this.selectedPrivacy = Constants.soPostPrivacy[this.user.settings.viewable_post.value];
  }
}
