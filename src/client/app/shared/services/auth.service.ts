import { Injectable } from '@angular/core';

import { UserService } from './user.service';

@Injectable()
export class AuthService {
  // store the URL so we can redirect after logging in
  redirectUrl: string;

  constructor(private userService: UserService) {
  }

  loggedIn() {
    return this.userService.get();
  }
}
