import { Component, OnInit } from '@angular/core';
import { SocialService } from '../services/social.service';
import { SoUser } from '../../../shared/models/social_network/so-user.model';

@Component({
  moduleId: module.id,
  selector: 'z-social-setting',
  templateUrl: 'setting.component.html'
})
export class ZSocialSettingComponent implements OnInit {

  user: SoUser = new SoUser();

  constructor(private socialService: SocialService) {
  }

  ngOnInit() {
    this.socialService.user.get().subscribe((res: any) => {
      this.user = new SoUser().from(res.data);
      console.log(this.user);
      },
    );
  }

  updateSettings(settings:any) {
    this.socialService.user.update({settings: settings}).subscribe((res: any) => {
      this.user = new SoUser().from(res.data);
      },
    );
  }
  resetSettings() {
    this.socialService.user.reset_setting().subscribe((res: any) => {
        this.user = new SoUser().from(res.data);
      },
    );
  }
}
