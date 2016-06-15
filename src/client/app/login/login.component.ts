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
import {UserService}        from '../shared/services/user.service';
import {TopMessageService}  from '../partials/topmessage/index';

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
              private _toadMessageService: TopMessageService
  ) {
    
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
            var next = this._params.getParam('next')===false ? '': this._params.getParam('next').replace(/\%20/g,'\/');            
            this._router.navigateByUrl(next);
          }
        },
        error => {
          this._toadMessageService.activate(this._toadMessageService.type.danger, 'Email or password is not valid');
          // console.log("login error:", error);
        }
      );
  }

}
