import { Injectable }       from '@angular/core';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild
}                           from '@angular/router';
import { AuthService }      from './auth.service';
import { Constants } from '../constant/config/constants';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    let url: string = window.location['href'];
    return this.checkLogin(url);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return this.canActivate(route, state);
  }

  checkLogin(url: string): Promise<boolean> {
    return this.authService.loggedIn().then((res: any) => {
      if(res)
        return Promise.resolve(true);
      else {
        window.location.href = `${Constants.baseUrls.app}/login?returnUrl=${url}`;
        return Promise.resolve(false);
      }
    });
  }
}

