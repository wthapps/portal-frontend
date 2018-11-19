import { Component, OnInit, ViewChild } from '@angular/core';
import { WthConfirmService } from '@shared/services';
import { BsModalComponent } from 'ng2-bs3-modal';
import { SoUser } from '@shared/shared/models';
import { SocialService } from '@social/shared/services/social.service';
import { Store } from '@ngrx/store';
import { SO_PROFILE_UPDATE_DONE } from '@social/shared/reducers';
import { Constants } from '@shared/constant';


@Component({
  selector: 'z-social-shared-setting',
  templateUrl: 'settings.component.html',
  styleUrls: ['settings.component.scss']
})

export class ZSocialSharedSettingsComponent implements OnInit {
  @ViewChild('modal') modal: BsModalComponent;
  user: SoUser = new SoUser();
  loading = true;
  readonly PRIVACIES: string[] = ['public', 'friends', 'personal'];
  readonly PRIVACY_NAMES: any = {
    public: 'Public',
    friends: 'Friends',
    personal: 'Personal'
  };
  readonly POST_PRIVACIES = Constants.soPostPrivacy;

  constructor(
    private socialService: SocialService,
    private store: Store<any>,
    private wthConfirmService: WthConfirmService
  ) {
    //
  }

  ngOnInit() {
    this.loading = true;
    this.socialService.user
      .get()
      .toPromise()
      .then((res: any) => {
        this.user = new SoUser().from(res.data);
        this.loading = false;
      })
      .catch(err => this.loading = false);
  }

  open() {
    this.modal.open();
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

  cancel() {
    this.modal.close();
  }

  save() {
    console.log('updating settings');
  }
}
