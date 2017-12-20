import { Component, OnInit } from '@angular/core';

import 'rxjs/add/operator/toPromise';

import { SocialService } from '../shared/services/social.service';
import { SoUser } from '@wth/shared/shared/models';
import { WthConfirmService } from '@wth/shared/shared/components/confirmation/wth-confirm.service';

@Component({
  moduleId: module.id,
  selector: 'z-social-setting',
  templateUrl: 'setting.component.html'
})
export class ZSocialSettingComponent implements OnInit {

  user: SoUser = new SoUser();

  constructor(private socialService: SocialService,
              private wthConfirmService: WthConfirmService) {
  //
  }

  ngOnInit() {
    this.socialService.user.get().subscribe((res: any) => {
        this.user = new SoUser().from(res.data);
      },
    );
  }

  updateSettings(settings: any) {
    this.socialService.user.update({settings: settings}).subscribe((res: any) => {
        this.user = new SoUser().from(res.data);
      },
    );
  }

  resetSettings() {
    this.wthConfirmService.confirm({
      acceptLabel: 'Reset',
      rejectLabel: 'Cancel',
      message: 'Are you sure you want to reset settings?',
      header: 'Reset Default',
      accept: () => {
        this.socialService.user.reset_setting()
          .toPromise().then((res: any) => {
            this.user = new SoUser().from(res.data);
          },
        );
      }
    });


  }
}
