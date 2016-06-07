import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router';
import {ApiBaseService} from "../../shared/services/apibase.service"

@Component({
  moduleId: module.id,
  templateUrl: 'forgotten-password.component.html',
  directives: [
    ROUTER_DIRECTIVES
  ]
})

export class ForgottenPasswordComponent {

  constructor(private _router:Router, private _apiBaseService: ApiBaseService) {
  }

  onSubmit():void {
    this._router.navigate(['/account/reset_email_sent']);
  }

  forgottenPassword(email):void {

    let body = JSON.stringify({email});
    this._apiBaseService.post('users/recovery/initiate', body)
      .subscribe((result) => {
          this._router.navigate(['/account/reset_email_sent']);
        },
        error => {
          console.log("error:", error);
        });
  }
}
