import { Component } from '@angular/core';
import { Router } from '@angular/router';

import {
  FormGroup,
  AbstractControl,
  FormBuilder,
  Validators
} from '@angular/forms';

import {
  ApiBaseService,
  ToastsService,
  LoadingService,
  CustomValidator
} from '../../shared/index';


@Component({
  moduleId: module.id,
  templateUrl: 'forgotten-password.component.html'
})

export class ForgottenPasswordComponent {
  form: FormGroup;
  email: AbstractControl;
  submitted: boolean = false;

  constructor(private fb: FormBuilder,
              private router: Router,
              private toastsService: ToastsService,
              private loadingService: LoadingService,
              private apiBaseService: ApiBaseService) {

    this.form = fb.group({
      'email': ['',
        Validators.compose([Validators.required, CustomValidator.emailFormat])
      ]
    });

    this.email = this.form.controls['email'];
  }

  onSubmit(values: any): void {
    this.submitted = true;
    if (this.form.valid) {
      // start loading
      this.loadingService.start();

      let email = values.email;

      this.apiBaseService.get(`users/search?email=${email}`)
        .subscribe((result: any) => {
            if (result.data === null) {
              // stop loading
              this.loadingService.stop();
              this.toastsService.danger(result.message);
            } else {
              let body = JSON.stringify({email});
              this.apiBaseService.post('users/recovery/initiate', body)
                .subscribe((res) => {
                    // stop loading
                    this.loadingService.stop();
                    this.router.navigate(['/account/recovery/reset_email_sent']);
                  },
                  error => {
                    // stop loading
                    this.loadingService.stop();
                    this.toastsService.danger(error);
                    console.log('error:', error);
                  });
            }
          },
          error => {
            // stop loading
            this.loadingService.stop();
            this.toastsService.danger(error);
          });
    }
  }
}


