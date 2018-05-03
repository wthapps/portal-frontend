import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';

import { SocialService } from '../shared/services/social.service';
import { SoUser } from '@wth/shared/shared/models';
import { WthConfirmService } from '@wth/shared/shared/components/confirmation/wth-confirm.service';
import { SO_PROFILE_UPDATE_DONE } from '../shared/reducers/index';

@Component({
  selector: 'z-social-setting',
  templateUrl: 'setting.component.html'
})
export class ZSocialSettingComponent implements OnInit {
  user: SoUser = new SoUser();
  loading: boolean = true;
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
  }

  ngOnInit() {
    this.socialService.user
      .get()
      .toPromise()
      .then((res: any) => {
        this.user = new SoUser().from(res.data);
        this.loading = false;
      })
      .catch(err => this.loading = false);
  }

  updateSettings(settings: any) {
    this.socialService.user
      .update({ settings: settings })
      .subscribe((res: any) => {
        this.user = new SoUser().from(res.data);
        this.store.dispatch({
          type: SO_PROFILE_UPDATE_DONE,
          payload: res.data
        });
      });
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
            this.store.dispatch({
              type: SO_PROFILE_UPDATE_DONE,
              payload: res.data
            });
          });
      }
    });
  }
}
