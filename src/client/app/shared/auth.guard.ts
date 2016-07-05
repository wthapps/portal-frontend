import {CanActivate}  from '@angular/router';

export class AuthGuard implements CanActivate {
  canActivate() {
    console.log('AuthGuard#testing');
    return true;
  }
}
