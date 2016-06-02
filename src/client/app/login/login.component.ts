import {Component}    from '@angular/core';
import {
  ROUTER_DIRECTIVES,
  Router,
  RouteSegment
}    from '@angular/router';
import {UserService}    from '../shared/services/user.service';


@Component({
  moduleId: module.id,
  templateUrl: 'login.component.html',
  directives: [
    ROUTER_DIRECTIVES
  ]
})

export class LoginComponent {

  // TODO Consider replacing RouteSegment  by RouteParams when Angular 2 version will be released
  constructor(private _router:Router,
              private _userService:UserService,
              private _params:RouteSegment) {
    this._backUrl = this._params.parameters['back_url'];
  }

  login(email:string, password:string) {
    let body = JSON.stringify({user: {email, password}});
    this._userService.login('users/sign_in', body, false)
      .subscribe((result) => {
          if (result) {
            this._router.navigateByUrl('');
          }
        }
      );
  }

}
