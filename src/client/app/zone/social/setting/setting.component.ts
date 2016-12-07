import { Component, OnInit } from '@angular/core';
import { SocialService } from '../services/social.service';
import { SoUser } from '../../../shared/models/social_network/so-user.model';

import {
  ConfirmationService
}                           from '../../../shared/index';

@Component({
  moduleId: module.id,
  selector: 'z-social-setting',
  templateUrl: 'setting.component.html'
})
export class ZSocialSettingComponent implements OnInit {

  user: SoUser = new SoUser();

  constructor(private socialService: SocialService,
              private confirmationService: ConfirmationService) {
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
    this.confirmationService.confirm({
      message: 'Are you sure you want to reset settings',
      header: 'Reset Default',
      accept: () => {
        this.socialService.user.reset_setting().subscribe((res: any) => {
            this.user = new SoUser().from(res.data);
          },
        );
      }
    });


  }
}
