import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {FormBuilder, Validators, ControlGroup, NgForm, NgFormModel} from '@angular/common';
import {AccountMenuComponent} from '../menu/account-menu.component';
import {UserService} from "../../shared/services/user.service";
import {ControlMessages} from '../../shared/control.message.component'
import {ValidationService} from '../../shared/services/validation.service'

@Component({
  moduleId: module.id,
  templateUrl: 'change-password.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    AccountMenuComponent,
    ControlMessages
  ]
})

export class ChangePasswordComponent {
  PanelTitle: string = 'Change password';
  changePasswordForm: any;

  constructor(private _userService: UserService, private _builder: FormBuilder){
    this.changePasswordForm = this._builder.group({
      oldpassword: ['', Validators.required],
      password: ['', Validators.compose([
        Validators.required,
        ValidationService.passwordValidator
      ])],
      password_confirmation: ['',  Validators.compose([
        Validators.required,
        ValidationService.passwordValidator,
        ValidationService.passwordConfirmationValidator
      ])],
      // password: Validators.compose([Validators.required, Validators.minLength(6)]),
      // password_confirmation: Validators.compose([Validators.required, Validators.minLength(6)])
    });
  }

  public changePassword(old_password: string, password: string){
    let body = JSON.stringify({
      old_password: old_password,
      password: password
    });
    this._userService.changePassword(`users/${this._userService.profile.id}`, body)
      .subscribe((result) => {
          if (result.success) {
            console.log("change password:", result.message);
          }else {
            console.log("change password error:", result.message);
          }
        },
        error => {
          console.log("login error:", error.message);
        }
      );
  }
}
