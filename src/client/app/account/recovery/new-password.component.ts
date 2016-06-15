import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES, Router, RouteSegment} from '@angular/router';
import {
  Control,
  FormBuilder,
  ControlGroup,
  Validators
}                           from '@angular/common';
// import {RouteParams}        from '@angular/router-deprecated';
import {ApiBaseService}     from "../../shared/services/apibase.service"
import {CustomValidators}   from '../../shared/validator/custom-validators';
import {TopMessageService} from "../../partials/topmessage/top-message.service";

@Component({
  moduleId: module.id,
  templateUrl: 'new-password.component.html',
  directives: [
    ROUTER_DIRECTIVES
  ]
})

export class NewPasswordComponent {

  newPasswordForm: ControlGroup;
  password: Control;
  id: any;
  code: string;
  constructor(private _router:Router,
              private _apiBaseService: ApiBaseService,
              private _formBuilder: FormBuilder,
              private _params: RouteSegment,
              private _toadMessageService: TopMessageService
  ) {
    this.newPasswordForm = _formBuilder.group({
      password: ['', Validators.compose([Validators.required, CustomValidators.emailFormat]), CustomValidators.duplicated]
    });
  }


  saveNewPassword(password: string):void {

    let body = JSON.stringify({
      id: this._params.getParam('u'),
      reset_code: this._params.getParam('c'),
      password
    });
    this._apiBaseService.put('users/recovery/password', body)
      .subscribe((result) => {
          if(result.data === null){

          }else{
            this._router.navigate(['/login']);
          }
        },
        error => {
          this._toadMessageService.activate(this._toadMessageService.type.danger, error);
          console.log("error:", error);
        });
  }
}
