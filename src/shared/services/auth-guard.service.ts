import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild
} from '@angular/router';
import { AuthService } from './auth.service';
import { Constants } from '@wth/shared/constant';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    let url: string = window.location['href'];
    return this.checkLogin(url);
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return this.canActivate(route, state);
  }

  private checkLogin(url: string): boolean {
    // if (this.authService.loggedIn && !this.authService.user.confirmed_at) {
    //   location.href = `${Constants.baseUrls.myAccount}/users/alert?alertType=complete_signup`;
    // }
    if (this.authService.loggedIn) {
      return true;
    }
    this.authService.redirectUrl = window.location.href;
    let currentUrl = location.toString();

    if (`${Constants.baseUrls}/` === currentUrl) {
      this.router.navigate(['/login']);
    } else {
      location.href = `${Constants.baseUrls.app}/login?returnUrl=${
        window.location.href
      }`;
    }

    return false;
  }
}
