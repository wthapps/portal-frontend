import { Injectable }       from '@angular/core';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild
}                           from '@angular/router';
import { AuthService }      from './auth.service';
import { Constants } from '../constant/config/constants';
import { UserService } from "./user.service";

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private userService: UserService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    let url: string = window.location['href'];
    return this.checkLogin(url);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return this.canActivate(route, state);
  }

  checkLogin(url: string): Promise<boolean> {
    if (this.userService.loggedIn && this.userService.validProfile()) {
      return Promise.resolve(true);
    }
    window.location.href = `${Constants.baseUrls.app}/login?returnUrl=${window.location['href']}`;
    return Promise.resolve(false);
  }
}
