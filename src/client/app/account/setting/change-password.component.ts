import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

import {AccountMenuComponent} from '../menu/account-menu.component';
import {UserService} from "../../shared/services/user.service";

@Component({
  moduleId: module.id,
  templateUrl: 'change-password.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    AccountMenuComponent
  ]
})

export class ChangePasswordComponent {
  PanelTitle:string = 'Change password';

  constructor(private _userService: UserService){

  }

  public changePassword(old_password: string, password: string){
    let body = JSON.stringify({
      old_password: old_password,
      password: password
    });
    this._userService.changePassword(`users/${this._userService.profile.id}`, body)
      .subscribe((result) => {
          if (result) {

          }
        },
        error => {
          console.log("login error:", error.message);
        }
      );
  }
}
