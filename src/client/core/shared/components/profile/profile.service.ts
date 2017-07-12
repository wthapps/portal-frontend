import { Injectable } from '@angular/core';
import { ApiBaseService } from '../../services/apibase.service';
import { UserService } from '../../services/user.service';

@Injectable()
export class PartialsProfileService {

  constructor(private apiBaseService: ApiBaseService,
              private userService: UserService) {
    console.log(this.userService);
    console.log(this.apiBaseService);
  }

  getMyProfile() {
    return this.apiBaseService.get(`zone/social_network/users/${this.userService.profile.uuid}`);
  }

  updateMyProfile(body: any) {
    return this.apiBaseService.put(`zone/social_network/users/${this.userService.profile.uuid}`, body);
  }

}
