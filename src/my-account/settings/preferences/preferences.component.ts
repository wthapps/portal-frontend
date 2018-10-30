import { Component, OnInit }          from '@angular/core';
import 'rxjs/add/observable/fromPromise';
import {
  FormGroup,
  AbstractControl,
  FormBuilder,
  Validators
}                           from '@angular/forms';

import { UserService } from '@wth/shared/services/user.service';
import { ToastsService } from '@wth/shared/shared/components/toast/toast-message.service';
import { LoadingService } from '@wth/shared/shared/components/loading/loading.service';
import { Constants } from '@wth/shared/constant/config/constants';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'my-setting-preferences',
  templateUrl: 'preferences.component.html'
})

export class MyPreferencesComponent implements OnInit {
  pageTitle = 'Preferences';
  errorMessage: string = Constants.errorMessage.default;

  formValue: any;

  form: FormGroup;
  language: AbstractControl;
  subscribed: AbstractControl;
  auto_update: AbstractControl;

  submitted = false;

  constructor(private fb: FormBuilder,
              private toastsService: ToastsService,
              private loadingService: LoadingService,
              private userService: UserService) {

    this.form = fb.group({
      'language': [this.userService.getSyncProfile().language,
        Validators.compose([Validators.required])
      ],
      'subscribed': [this.userService.getSyncProfile().subscribed],
      'auto_update': [this.userService.getSyncProfile().auto_update],
    });

    this.language = this.form.controls['language'];
    this.subscribed = this.form.controls['subscribed'];
    this.auto_update = this.form.controls['auto_update'];
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
      const body = JSON.stringify({
        language: values.language,
        subscribed: values.subscribed,
        auto_update: values.auto_update,
      });

      this.userService.update(body)
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
   * @returns {boolean|Promise<boolean>}
   */
  //2 canDeactivate(): Promise<boolean> | boolean {
  //   return this.deactivateConfirmService.activate(this.formValue, this.form.value);
  // }
}
