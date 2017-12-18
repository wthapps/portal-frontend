import { Injectable } from '@angular/core';

import { UserService } from './user.service';
import { CookieService } from 'ngx-cookie';

@Injectable()
export class AuthService {
  // store the URL so we can redirect after logging in
  redirectUrl: string;
  sessionChecked: boolean;

  constructor(private userService: UserService,
              private cookieService: CookieService) {
  }

  loggedIn(): Promise<boolean> {
    if(this.userService.loggedIn && this.cookieService.get('jwt') && this.cookieService.get('profile')) {
      if(this.sessionChecked)
        return Promise.resolve(true);
      else
        return this.userService.validateSession().toPromise().then((res: any) => {
          this.sessionChecked = true;
          return res.valid;
        })
          .catch((error: any) => {
            if (error.status === 401 && error.statusText == 'Unauthorized') {
              return Promise.resolve(false);
            } else
              return Promise.resolve(true);
          });
    } else
      return Promise.resolve(false);
}
}
