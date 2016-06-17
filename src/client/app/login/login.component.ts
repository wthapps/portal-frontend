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
  TopMessageService
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
  
  // TODO Consider replacing RouteSegment  by RouteParams when Angular 2 version will be released
  constructor(private _router:Router,
              private _userService:UserService,
              private _params:RouteSegment,
              builder:FormBuilder,
              private _topMessageService:TopMessageService) {

    this.group = builder.group({
      email: ['',
        Validators.compose([Validators.required, CustomValidators.emailFormat])
      ],
      password: ['',
        Validators.compose([Validators.required])
      ]
    });
  }

  login() {
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
          this._topMessageService.activate(this._topMessageService.type.danger, 'Email or password is invalid');
          // console.log("login error:", error);
        }
      );
  }

}
