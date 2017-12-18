import { Injectable } from '@angular/core';

import { UserService } from './user.service';
import { CookieService } from 'ngx-cookie';

@Injectable()
export class AuthService {
  // store the URL so we can redirect after logging in
  redirectUrl: string;

  constructor(private userService: UserService,
              private cookieService: CookieService) {
  }

  loggedIn() {
    return this.userService.loggedIn && this.cookieService.get('jwt') && this.cookieService.get('profile');
  }
}
