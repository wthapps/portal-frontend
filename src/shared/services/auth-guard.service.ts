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
import { map } from 'rxjs/operators';
import { UserService } from '@shared/services/user.service';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private router: Router, private authService: AuthService, private userService: UserService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> {
    let url: string = window.location['href'];
    return this.checkLogin(url);
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> {
    return this.canActivate(route, state);
  }

  private checkLogin(url: string): boolean | Observable<boolean> {
    if (this.authService.loggedIn) {
      return this.userService.getProfile(this.authService.user.uuid).pipe(
        map(response => {
          const profile = response.data.attributes;
          if (!profile) {
            return false;
          } else {
            if (!profile.confirmed_at) {
              location.href = `${ Constants.baseUrls.myAccount }/users/alert?alertType=complete_signup`;
              return false;
            }
            if (profile.deleted_at) {
              location.href = `${Constants.baseUrls.myAccount}/account-deleted?email=${this.authService.user.email}`;
              return false;
            }
          }
          return true;
        })
      );
    } else {
      console.log('redirect:::', this.authService.user);
      if (location.href.indexOf(Constants.baseUrls.app) > -1) {
        this.router.navigate(['/login']);
        return false;
      } else {
        location.href = `${ Constants.baseUrls.app }/login?returnUrl=${ window.location.href }`;
        return false;
      }

      return false;
    }
  }
}
