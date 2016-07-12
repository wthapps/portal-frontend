import {Component}          from '@angular/core';
import {
  ROUTER_DIRECTIVES,
  Router,
  ActivatedRoute
}                           from '@angular/router';


import {
  FORM_DIRECTIVES,
  FormBuilder,
  ControlGroup,
  Validators
}                           from '@angular/common';

import {CustomValidators}   from '../shared/validator/custom-validators';
import {
  UserService,
  ToastsService,
  LoadingService,
  RedirectService
}                           from '../shared/index';

@Component({
  moduleId: module.id,
  templateUrl: 'login.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    FORM_DIRECTIVES
  ]
})

export class LoginComponent {
  group:ControlGroup;
  errorMessage:string = '';

  // TODO Consider replacing RouteSegment  by RouteParams when Angular 2 version will be released
  constructor(private _router:Router,
              private _userService:UserService,
              private _params:ActivatedRoute,
              private _builder:FormBuilder,
              private _toastsService:ToastsService,
              private _loadingService:LoadingService,
              private _redirectService:RedirectService) {
    if (this._userService.loggedIn) {
      this._router.navigateByUrl('/account/setting/dashboard');
    }

    this.group = this._builder.group({
      email: ['',
        Validators.compose([Validators.required, CustomValidators.emailFormat])
      ],
      password: ['',
        Validators.compose([Validators.required])
      ]
    });


  }


  login(email:string, password:string) {
    // start loading
    this._loadingService.start();
    let body = JSON.stringify({user: {email, password}});
    this._userService.login('users/sign_in', body)
      .subscribe((result) => {
          if (result) {
            let prev = this._redirectService.prev(this._params);
            this._loadingService.stop();
            this._router.navigateByUrl(prev);
          }
        },
        error => {
          this._toastsService.danger('Invalid email or password');
          //console.log('login error:', error);

          // stop loading
          this._loadingService.stop();
        }
      );
  }

}
