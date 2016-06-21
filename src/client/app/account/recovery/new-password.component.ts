import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES, Router, RouteSegment} from '@angular/router';
import {
  FORM_DIRECTIVES,
  FormBuilder,
  ControlGroup,
  Validators
}                           from '@angular/common';
import {
  TopMessageService,
  LoadingService,
  ApiBaseService
}                           from '../../shared/index';

@Component({
  moduleId: module.id,
  templateUrl: 'new-password.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    FORM_DIRECTIVES
  ]
})

export class NewPasswordComponent {
  newPasswordForm:ControlGroup;
  id:any;
  code:string;

  constructor(private _router:Router,
              private _apiBaseService:ApiBaseService,
              private _formBuilder:FormBuilder,
              private _params:RouteSegment,
              private _loadingService:LoadingService,
              private _topMessageService:TopMessageService) {
    this.newPasswordForm = this._formBuilder.group({
      password: ['',
        Validators.compose([Validators.required, Validators.minLength(6)])
      ]
    });
  }

  saveNewPassword():void {
    // start loading
    this._loadingService.start();

    let password:string = this.newPasswordForm.value.password;
    let body = JSON.stringify({
      id: this._params.getParam('u'),
      reset_code: this._params.getParam('c'),
      password
    });
    this._apiBaseService.put('users/recovery/password', body)
      .subscribe((result) => {
          if (result.data === null) {
            // stop loading
            this._loadingService.stop();
            this._topMessageService.danger(result.message);
          } else {
            this._router.navigate(['/login']);
          }
        },
        error => {
          // stop loading
          this._loadingService.stop();
          this._topMessageService.danger(error);
          console.log("error:", error);
        });
  }
}
