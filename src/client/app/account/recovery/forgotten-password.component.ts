import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router';
import {
  FORM_DIRECTIVES,
  FormBuilder,
  ControlGroup,
  Validators
}                           from '@angular/common';
import {CustomValidators}   from '../../shared/validator/custom-validators';
import {
  TopMessageService,
  LoadingService,
  ApiBaseService
}                           from '../../shared/index';

@Component({
  moduleId: module.id,
  templateUrl: 'forgotten-password.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    FORM_DIRECTIVES
  ]
})

export class ForgottenPasswordComponent {

  forgottenPasswordForm:ControlGroup;
  errorMessage:string = '';

  constructor(private _router:Router,
              private _apiBaseService:ApiBaseService,
              private _formBuilder:FormBuilder,
              private _topMessageService:TopMessageService,
              private _loadingService:LoadingService) {
    this.forgottenPasswordForm = this._formBuilder.group({
      email: ['',
        Validators.compose([Validators.required, CustomValidators.emailFormat])
      ]
    });
  }

  forgottenPassword():void {
    // start loading
    this._loadingService.start();

    let email:string = this.forgottenPasswordForm.value.email;

    this._apiBaseService.get(`users/search?email=${email}`)
      .subscribe((response) => {
          var result = response.json();
          if (result.data === null) {
            // stop loading
            this._loadingService.stop();
            this._topMessageService.danger(result.message);
          } else {
            let body = JSON.stringify({email});
            this._apiBaseService.post('users/recovery/initiate', body)
              .subscribe((result) => {
                  // stop loading
                  this._loadingService.stop();
                  this._router.navigate(['/account/reset_email_sent']);
                },
                error => {
                  // stop loading
                  this._loadingService.stop();
                  this._topMessageService.danger(error);
                  console.log("error:", error);
                });
            // this._router.navigate(['/account/reset_email_sent']);
          }
        },
        error => {
          // stop loading
          this._loadingService.stop();
          this._topMessageService.danger(error);
          console.log('error:', error);
        });
  }
}
