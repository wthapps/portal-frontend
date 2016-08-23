import {Component, OnInit}          from '@angular/core';
import {Observable}                   from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
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
  DialogService,
  Constants
}                           from '../../shared/index';

declare var _: any;

@Component({
  moduleId: module.id,
  templateUrl: 'preferences.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    REACTIVE_FORM_DIRECTIVES
  ]
})

export class PreferencesComponent implements OnInit{
  pageTitle: string = 'Preferences';
  errorMessage: string = Constants.errorMessage.default;

  formValue: any;

  form: FormGroup;
  language: AbstractControl;
  subscribed: AbstractControl;
  auto_update: AbstractControl;
  use_diagnosis: AbstractControl;

  submitted: boolean = false;

  constructor(private fb: FormBuilder,
              private userService: UserService,
              private toastsService: ToastsService,
              private dialogService: DialogService,
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

  ngOnInit(): void {
    // Set value before updating form (checking user leave this page)
    this.formValue = this.form.value;
  }

  onSubmit(values: any): void {
    // Set value after updating form (checking user leave this page)
    this.formValue = values;

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

  /**
   *
   * @returns {any}
   */
  canDeactivate(): Observable<boolean> | boolean {
    // Allow synchronous navigation (`true`) if no crisis or the crisis is unchanged
    if (!this.formValue || _.isEqual(this.formValue, this.form.value)) {
      return true;
    }
    // Otherwise ask the user with the dialog service and return its
    // promise which resolves to true or false when the user decides
    let p = this.dialogService.confirm();
    let o = Observable.fromPromise(p);
    return o;
  }
}
