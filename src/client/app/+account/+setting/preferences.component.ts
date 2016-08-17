import {Component}          from '@angular/core';
import {
  ROUTER_DIRECTIVES
}                           from '@angular/router';
import {
  REACTIVE_FORM_DIRECTIVES,
  FormGroup,
  AbstractControl,
  FormBuilder,
  Validators
}                           from '@angular/forms';

import {
  UserService,
  ToastsService,
  LoadingService,
  Constants
}                           from '../../shared/index';

@Component({
  moduleId: module.id,
  templateUrl: 'preferences.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    REACTIVE_FORM_DIRECTIVES
  ]
})

export class PreferencesComponent {
  pageTitle: string = 'Preferences';
  errorMessage: string = Constants.errorMessage.default;

  form: FormGroup;
  language: AbstractControl;
  subscribed: AbstractControl;
  auto_update: AbstractControl;
  use_diagnosis: AbstractControl;

  submitted: boolean = false;

  constructor(private fb: FormBuilder,
              private userService: UserService,
              private toastsService: ToastsService,
              private loadingService: LoadingService) {

    this.form = fb.group({
      'language': [this.userService.profile.language,
        Validators.compose([Validators.required])
      ],
      'subscribed': [this.userService.profile.subscribed],
      'auto_update': [this.userService.profile.auto_update],
      'use_diagnosis': [this.userService.profile.use_diagnosis],
    });

    this.language = this.form.controls['language'];
    this.subscribed = this.form.controls['subscribed'];
    this.auto_update = this.form.controls['auto_update'];
    this.use_diagnosis = this.form.controls['use_diagnosis'];
  }

  onSubmit(values: any): void {
    this.submitted = true;
    if (this.form.valid) {

      this.loadingService.start();
      let body = JSON.stringify({
        language: values.language,
        subscribed: values.subscribed,
        auto_update: values.auto_update,
        use_diagnosis: values.use_diagnosis,
      });

      this.userService.update(`users/${this.userService.profile.id}`, body)
        .subscribe(
          (result: any) => {
            this.loadingService.stop();
            this.toastsService.success(result.message);
          },
          error => {
            this.loadingService.stop();
            this.toastsService.danger(this.errorMessage);
          }
        );
    }
  }
}
