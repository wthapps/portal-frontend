import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router';
import {FormBuilder, Validators} from '@angular/common';
import {ControlMessages} from '../../shared/control.message.component';
import {ValidationService} from '../../shared/services/validation.service';
import {
  UserService,
  LoadingService,
  TopMessageService,
  CONFIG
} from '../../shared/index';

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
              private _loadingService:LoadingService,
              private _topMessageService:TopMessageService,
              private _builder:FormBuilder) {
    if (!this._userService.loggedIn) {
      _router.navigateByUrl(`/login;${CONFIG.params.next}=${this._router._location.path().replace(/\//g, '\%20')}`);
    }

    this.changePasswordForm = this._builder.group({
      oldpassword: ['', Validators.compose([
        Validators.required,
        ValidationService.passwordValidator
      ])],
      password: ['', Validators.compose([
        Validators.required,
        ValidationService.passwordValidator
      ])],
      password_confirmation: ['', Validators.compose([
        Validators.required,
        ValidationService.passwordValidator,
        ValidationService.passwordConfirmationValidator
      ])]
    });
  }

  public changePassword(old_password:string, password:string) {
    // start loading
    this._loadingService.start();

    let body = JSON.stringify({
      old_password: old_password,
      password: password
    });
    this._userService.changePassword(`users/${this._userService.profile.id}`, body)
      .subscribe((result) => {
          // stop loading
          this._loadingService.stop();
          if (result.success) {
            this._topMessageService.success(result.message);
            //console.log('change password:', result.message);
          } else {
            this._topMessageService.danger(result.message);
            //console.log('change password error:', result.message);
          }
        },
        error => {
          // stop loading
          this._loadingService.stop();
          this._topMessageService.danger(result.message);
          console.log('login error:', error.message);
        }
      );
  }
}
