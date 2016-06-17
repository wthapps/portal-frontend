import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router';
import {FormBuilder, Validators} from '@angular/common';
import {ControlMessages} from '../../shared/control.message.component';
import {ValidationService} from '../../shared/services/validation.service';
import {UserService, CONFIG} from '../../shared/index';

@Component({
  moduleId: module.id,
  templateUrl: 'change-password.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    ControlMessages
  ]
})

export class ChangePasswordComponent {
  PanelTitle:string = 'Change password';
  changePasswordForm:any;

  constructor(private _userService:UserService,
              private _router:Router,
              private _builder:FormBuilder) {
    if (!this._userService.loggedIn) {
      _router.navigateByUrl(`/login;${CONFIG.params.next}=${this._router._location.path().replace(/\//g, '\%20')}`);
    }

    this.changePasswordForm = this._builder.group({
      oldpassword: ['', Validators.required],
      password: ['', Validators.compose([
        Validators.required,
        ValidationService.passwordValidator
      ])],
      password_confirmation: ['', Validators.compose([
        Validators.required,
        ValidationService.passwordValidator,
        ValidationService.passwordConfirmationValidator
      ])],
      // password: Validators.compose([Validators.required, Validators.minLength(6)]),
      // password_confirmation: Validators.compose([Validators.required, Validators.minLength(6)])
    });
  }

  public changePassword(old_password:string, password:string) {
    let body = JSON.stringify({
      old_password: old_password,
      password: password
    });
    this._userService.changePassword(`users/${this._userService.profile.id}`, body)
      .subscribe((result) => {
          if (result.success) {
            console.log('change password:', result.message);
          } else {
            console.log('change password error:', result.message);
          }
        },
        error => {
          console.log('login error:', error.message);
        }
      );
  }
}
