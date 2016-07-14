import {Component}          from '@angular/core';
import {
  ROUTER_DIRECTIVES,
  Router
}                           from '@angular/router';

import {
  ApiBaseService,
  ToastsService,
  LoadingService,
  CustomValidator
}                           from '../../shared/index';

import {
  REACTIVE_FORM_DIRECTIVES,
  FormGroup,
  AbstractControl,
  FormBuilder,
  Validators
}                           from '@angular/forms';


@Component({
  moduleId: module.id,
  templateUrl: 'forgotten-password.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    REACTIVE_FORM_DIRECTIVES
  ]
})

export class ForgottenPasswordComponent {
  form:FormGroup;
  email:AbstractControl;
  submitted:boolean = false;

  constructor(private fb:FormBuilder,
              private _router:Router,
              private _apiBaseService:ApiBaseService,
              private _toastsService:ToastsService,
              private _loadingService:LoadingService) {

    this.form = fb.group({
      'email': ['',
        Validators.compose([Validators.required, CustomValidator.emailFormat])
      ]
    });

    this.email = this.form.controls['email'];
  }

  onSubmit(values:any):void {
    this.submitted = true;
    if (this.form.valid) {
      // start loading
      this._loadingService.start();

      let email = values.email;

      this._apiBaseService.get(`users/search?email=${email}`)
        .subscribe((response) => {
            var result = response.json();
            if (result.data === null) {
              // stop loading
              this._loadingService.stop();
              this._toastsService.danger(result.message);
            } else {
              let body = JSON.stringify({email});
              this._apiBaseService.post('users/recovery/initiate', body)
                .subscribe((result) => {
                    // stop loading
                    this._loadingService.stop();
                    this._router.navigate(['/account/recovery/reset_email_sent']);
                  },
                  error => {
                    // stop loading
                    this._loadingService.stop();
                    this._toastsService.danger(error);
                    console.log('error:', error);
                  });
            }
          },
          error => {
            // stop loading
            this._loadingService.stop();

            this._toastsService.danger(error);
          });
    }
  }
}



