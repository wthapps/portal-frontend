import {Component}          from '@angular/core';
import {
  ROUTER_DIRECTIVES,
  Router,
  RouteSegment
}                           from '@angular/router';
import {
  FORM_DIRECTIVES,
  FormBuilder,
  ControlGroup,
  Validators
}                           from '@angular/common';
import {CustomValidators}   from '../shared/validator/custom-validators';
import {
  CONFIG,
  UserService,
  TopMessageService,
  LoadingService
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
              private _params:RouteSegment,
              private _builder:FormBuilder,
              private _topMessageService:TopMessageService,
              private _loadingService:LoadingService) {
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

  login() {
    // start loading
    this._loadingService.start();

    var email:string = this.group.value.email;
    var password:string = this.group.value.password;
    let body = JSON.stringify({user: {email, password}});
    this._userService.login('users/sign_in', body, false)
      .subscribe((result) => {
          if (result) {
            var next = this._params.getParam(CONFIG.params.next) === undefined ? '/' : this._params.getParam(CONFIG.params.next).replace(/\%20/g, '\/');
            this._router.navigateByUrl(next);
          }
        },
        error => {
          this._topMessageService.danger('Invalid email or password');
          // console.log("login error:", error);

          // stop loading
          this._loadingService.stop();
        }
      );
  }

}
