import {Component}          from '@angular/core';
import {
  ROUTER_DIRECTIVES
}                           from '@angular/router';
import {
  REACTIVE_FORM_DIRECTIVES,
  FormGroup,
  AbstractControl,
  FormBuilder,
  Validators
}                           from '@angular/forms';

import {
  UserService,
  ToastsService,
  LoadingService,
  CustomValidator,
  Constants
}                           from '../../shared/index';

@Component({
  moduleId: module.id,
  templateUrl: 'change-password.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    REACTIVE_FORM_DIRECTIVES
  ]
})

export class ChangePasswordComponent {
  pageTitle:string = 'Change Password';
  errorMessage:string = Constants.errorMessage.default;

  public form:FormGroup;
  public oldPassword:AbstractControl;
  public password:AbstractControl;
  public repeatPassword:AbstractControl;
  public passwords:FormGroup;

  public submitted:boolean = false;

  constructor(private fb:FormBuilder,
              private _userService:UserService,
              private _toastsService:ToastsService,
              private _loadingService:LoadingService) {

    this.form = fb.group({
      'oldPassword': ['', Validators.compose([Validators.required])],
      'passwords': fb.group({
        'password': ['', Validators.compose([Validators.required, Validators.minLength(6)])],
        'repeatPassword': ['', Validators.compose([Validators.required, Validators.minLength(6)])]
      }, {validator: CustomValidator.passwordsEqual('password', 'repeatPassword')})
    });

    this.oldPassword = this.form.controls['oldPassword'];
    this.passwords = <FormGroup> this.form.controls['passwords'];
    this.password = this.passwords.controls['password'];
    this.repeatPassword = this.passwords.controls['repeatPassword'];
  }

  public onSubmit(values:any):void {
    this.submitted = true;
    if (this.form.valid) {
      let old_password = values.oldPassword;
      let password = values.passwords.password;
      // start loading
      this._loadingService.start();

      let body = JSON.stringify({
        old_password: old_password,
        password: password
      });
      this._userService.changePassword(`users/${this._userService.profile.id}`, body)
        .subscribe((result:any) => {
            // stop loading
            this._loadingService.stop();
            if (result.success) {
              this._toastsService.success(result.message);
              //console.log('change password:', result.message);
            } else {
              this._toastsService.danger(result.message);
              //console.log('change password error:', result.message);
            }
          },
          error => {
            // stop loading
            this._loadingService.stop();
            this._toastsService.danger(error.message);
            console.log('login error:', error.message);
          }
        );
    }
  }
}
