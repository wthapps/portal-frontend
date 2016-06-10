import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router';
import {
  Control,
  FormBuilder,
  ControlGroup,
  Validators
}                           from '@angular/common';
import {ApiBaseService}     from "../../shared/services/apibase.service"
import {CustomValidators}   from '../../shared/validator/custom-validators';

@Component({
  moduleId: module.id,
  templateUrl: 'forgotten-password.component.html',
  directives: [
    ROUTER_DIRECTIVES
  ]
})

export class ForgottenPasswordComponent {

  forgottenPasswordForm: ControlGroup;
  email: Control;
  constructor(private _router:Router, private _apiBaseService: ApiBaseService, _formBuilder: FormBuilder) {
    this.forgottenPasswordForm = _formBuilder.group({
      email: ['', Validators.compose([Validators.required, CustomValidators.emailFormat]), CustomValidators.duplicated]
    });
  }

  onSubmit():void {
    this._router.navigate(['/account/reset_email_sent']);
  }

  forgottenPassword(email: string):void {

    let body = JSON.stringify({email});
    this._apiBaseService.get(`users/search?email=${email}`)
      .subscribe((response) => {
          var result = response.json();
          if(result.data == null){

          }else {
            // this._router.navigate(['/account/reset_email_sent']);
          }
        },
        error => {
          console.log("error:", error);
        });
    // this._apiBaseService.post('users/recovery/initiate', body)
    //   .subscribe((result) => {
    //       this._router.navigate(['/account/reset_email_sent']);
    //     },
    //     error => {
    //       console.log("error:", error);
    //     });
  }
}
