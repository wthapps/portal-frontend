import { Injectable } from '@angular/core';
import { ApiBaseService } from '../../services/apibase.service';
import { UserService } from '../../services/user.service';
import { Communication } from '../../models/communication.model';
import { ProfileConfig } from './profile-config.model';

@Injectable()
export class PartialsProfileService extends Communication {

  constructor(private apiBaseService: ApiBaseService,
              private userService: UserService) {
    super();
  }

  getMyProfile() {
    return this.apiBaseService.get(`zone/social_network/users/${this.userService.profile.uuid}`);
  }

  updateMyProfile(body: any) {
    return this.apiBaseService.put(`zone/social_network/users/${this.userService.profile.uuid}`, body);
  }

  onLoad(url: string) {
    if(url) {
      return this.apiBaseService.get(url);
    }
    return null;
  }

}
