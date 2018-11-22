import { Injectable } from '@angular/core';
import { ApiBaseService, UserService } from '@shared/services';
import { Communication } from '@shared/shared/helpers/communication/communication';

@Injectable()
export class PartialsProfileService extends Communication {

  constructor(private apiBaseService: ApiBaseService,
              private userService: UserService) {
    super();
  }

  getMyProfile() {
    return this.apiBaseService.get(`zone/social_network/users/${this.userService.getSyncProfile().uuid}`);
  }

  updateMyProfile(body: any) {
    return this.apiBaseService.put(`zone/social_network/users/${this.userService.getSyncProfile().uuid}`, body);
  }

  onLoad(url: string) {
    if (url) {
      return this.apiBaseService.get(url);
    }
    return null;
  }

}
