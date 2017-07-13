import { Component, OnInit, Input } from '@angular/core';
import { PartialsProfileService } from './profile.service';
import { ProfileConfig } from './profile-config.model';
import { UserContact } from '../../shared/models/user/user-contact.model';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'partials-profile',
  templateUrl: 'profile.component.html'
})

export class PartialsProfileComponent implements OnInit {
  @Input() dataConfig: any;
  @Input() data: any;

  config: ProfileConfig;

  constructor(private profileService: PartialsProfileService) {

  }

  ngOnInit() {
    this.config = new ProfileConfig(this.dataConfig);
    if (this.config.createNew) {
      this.data = new UserContact();
    } else {
      let load = this.profileService.onLoad(this.config);
      if (load) {
        load.subscribe((res: any) => {
          this.data = res.data;
        });
      }
    }
  }
}
