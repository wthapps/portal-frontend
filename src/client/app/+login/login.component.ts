import {Component}          from '@angular/core';
import {
  ROUTER_DIRECTIVES,
  Router,
  ActivatedRoute
}                           from '@angular/router';

import {
  UserService,
  ToastsService,
  LoadingService,
  RedirectService,
  CustomValidator
}                           from '../shared/index';

import {
  REACTIVE_FORM_DIRECTIVES,
  FormGroup,
  AbstractControl,
  FormBuilder,
  Validators
}                           from '@angular/forms';


@Component({
  moduleId: module.id,
  templateUrl: 'login.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    REACTIVE_FORM_DIRECTIVES
  ]
})

export class LoginComponent {
  form:FormGroup;
  email:AbstractControl;
  password:AbstractControl;
  submitted:boolean = false;

  constructor(private fb:FormBuilder,
              private _router:Router,
              private _userService:UserService,
              private _params:ActivatedRoute,
              private _toastsService:ToastsService,
              private _loadingService:LoadingService,
              private _redirectService:RedirectService) {

    if (this._userService.loggedIn) {
      this._router.navigateByUrl('/account/setting/profile');
    }

    this.form = fb.group({
      'email': ['',
        Validators.compose([Validators.required, CustomValidator.emailFormat])
      ],
      'password': ['',
        Validators.compose([Validators.required, Validators.minLength(4)])
      ]
    });

    this.email = this.form.controls['email'];
    this.password = this.form.controls['password'];
  }

  onSubmit(values:any):void {
    this.submitted = true;
    if (this.form.valid) {
      // start loading
      this._loadingService.start();

      let email = values.email;
      let password = values.password;

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
            // stop loading
            this._loadingService.stop();

            this._toastsService.danger('Invalid email or password');
            //console.log('login error:', error);
          }
        );
    }
  }
}



