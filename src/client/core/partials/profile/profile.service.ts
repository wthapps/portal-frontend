import { Injectable } from '@angular/core';
import { ApiBaseService } from '../../shared/services/apibase.service';
import { UserService } from '../../shared/services/user.service';
import { Communication } from '../../shared/models/communication.model';
import { ProfileConfig } from './profile-config.model';

@Injectable()
export class PartialsProfileService extends Communication {

  constructor(private apiBaseService: ApiBaseService,
              private userService: UserService) {
    super();
  }

  // getMyProfile() {
  //   return this.apiBaseService.get(`zone/social_network/users/${this.userService.profile.uuid}`);
  // }
  //
  // updateMyProfile(body: any) {
  //   return this.apiBaseService.put(`zone/social_network/users/${this.userService.profile.uuid}`, body);
  // }

  onLoad(config: ProfileConfig) {
    if(config.onLoadUrl) {
      return this.apiBaseService.get(config.onLoadUrl);
    }
    return null;
  }

  updateMyProfile(body: any) {
    return this.apiBaseService.put(`zone/social_network/users/${this.userService.profile.uuid}`, body);
  }

}
