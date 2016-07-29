import {Injectable}           from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
}                             from '@angular/router';
import {AuthService}          from './auth.service';
import {RedirectService}      from './redirect.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService:AuthService,
              private router:Router,
              private redirectService:RedirectService) {
  }

  canActivate(next:ActivatedRouteSnapshot,
              state:RouterStateSnapshot) {
    if (this.authService.loggedIn) {
      return true;
    }
    let linkState:any = this.redirectService.toLogin(state);
    console.log(linkState);
    this.router.navigateByUrl(linkState);
    return false;
  }
}
