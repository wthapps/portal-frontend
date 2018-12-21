import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiBaseService, UrlService } from '@shared/services';
import { Constants } from '@wth/shared/constant/config/constants';
import { CommonEventService } from '@wth/shared/services/common-event/common-event.service';
import { UserService } from '@wth/shared/services/user.service';
import { CountryService } from '@wth/shared/shared/components/countries/countries.service';
import { LoadingService } from '@wth/shared/shared/components/loading/loading.service';
import { ToastsService } from '@wth/shared/shared/components/toast/toast-message.service';

import { CustomValidator } from '@wth/shared/shared/validator/custom.validator';

import { Subject } from 'rxjs';

@Component({
  selector: 'my-setting-profile',
  templateUrl: 'profile.component.html'
})

export class MyProfileComponent implements OnInit, OnDestroy {
  errorMessage = Constants.errorMessage.default;
  profile_image = '';

  sex = 0;

  yearRange: string;

  formValue: any;

  countriesCode: any;

  form: FormGroup;
  first_name: AbstractControl;
  last_name: AbstractControl;
  email: AbstractControl;
  phone_prefix: AbstractControl;
  phone_number: AbstractControl;
  birthday: AbstractControl;

  submitted = false;
  confirmedEmail: any = null;
  verified = false;
  phoneChanged = false;
  private destroySubject: Subject<any> = new Subject<any>();

  constructor(public userService: UserService,
              private fb: FormBuilder,
              private countryService: CountryService,
              private toastsService: ToastsService,
              private apiBaseService: ApiBaseService,
              private urlService: UrlService,
              private commonEventService: CommonEventService,
              private loadingService: LoadingService) {
    this.sex = this.userService.getSyncProfile().sex === null ? 0 : this.userService.getSyncProfile().sex;

    const d = new Date();
    const yearRangeEnd = d.getFullYear();
    const yearRangestar = yearRangeEnd - 100;
    this.yearRange = `${yearRangestar}:${yearRangeEnd}`;

    if (!this.userService.getSyncProfile().profile_image) {
      this.userService.getSyncProfile().profile_image = Constants.img.avatar;
    }

    let birthday: any = '';
    if (this.userService.getSyncProfile().birthday !== null) {
      birthday = new Date(this.userService.getSyncProfile().birthday);
    }

    this.form = fb.group({
      'first_name': [this.userService.getSyncProfile().first_name,
        Validators.compose([Validators.required, CustomValidator.blanked])
      ],
      'last_name': [this.userService.getSyncProfile().last_name,
        Validators.compose([Validators.required, CustomValidator.blanked])
      ],
      'email': [
        { value: this.userService.getSyncProfile().email, disabled: true },
        Validators.compose([Validators.required, CustomValidator.emailFormat])
      ],
      'phone_prefix': [this.userService.getSyncProfile().nationality],
      'phone_number': [this.userService.getSyncProfile().phone_number],
      'birthday': [birthday]
    });

    this.first_name = this.form.controls['first_name'];
    this.last_name = this.form.controls['last_name'];
    this.email = this.form.controls['email'];
    this.phone_prefix = this.form.controls['phone_prefix'];
    this.phone_number = this.form.controls['phone_number'];
    this.birthday = this.form.controls['birthday'];
  }

  ngOnInit(): void {
    // verified email
    if (this.urlService.getQuery() && this.urlService.getQuery().verified === 'true') {
      this.toastsService.success('You have successfully verify your email address');
    }
    if (this.urlService.getQuery() && this.urlService.getQuery().verified === 'false') {
      this.toastsService.danger('Cannot verify your email address. Please try again');
    }
    this.apiBaseService.post('users/get_user').subscribe((res: any) => {
      this.confirmedEmail = res.data.confirmed_at;
    });
    // Set value before updating form (checking user leave this page)
    this.formValue = this.form.value;

    this.profile_image = this.userService.getSyncProfile().profile_image;
    this.countryService.getCountries().subscribe(
      (data: any) => this.countriesCode = data,
      (error: any) => this.errorMessage = <any>error);
  }

  ngOnDestroy() {
    this.destroySubject.next();
    this.destroySubject.unsubscribe();
  }

  onSubmit(values: any): void {
    const birthday_c = new Date(values.birthday);
    // console.log(birthday_c.getDate(), birthday_c.getMonth() + 1, birthday_c.getUTCFullYear());

    // Set value after updating form (checking user leave this page)
    this.formValue = values;

    this.submitted = true;

    if (this.form.valid) {
      // start loading
      this.loadingService.start();

      values.sex = this.sex;

      const body = JSON.stringify({
        first_name: values.first_name,
        last_name: values.last_name,
        nationality: values.phone_prefix,
        phone_number: values.phone_number,
        birthday_day: birthday_c.getDate().toString(),
        birthday_month: (birthday_c.getMonth() + 1).toString(),
        birthday_year: birthday_c.getUTCFullYear().toString(),
        sex: values.sex
      });

      this.userService.update(body)
        .subscribe((result: any) => {
            // stop loading
            this.loadingService.stop();
            this.toastsService.success(result.message);
          },
          error => {
            // stop loading
            this.loadingService.stop();
            this.toastsService.danger(this.errorMessage);
            console.log(error);
          }
        );
    }
  }

  sendVerifyEmail() {
    this.apiBaseService.post(`users/confirmation`).subscribe((res: any) => {
      this.toastsService.success('A verification email was sent to your email address');
    });
  }

  onCompleteChange(country: any) {
    this.form.controls['phone_prefix'].setValue(country.code);
    this.phoneChanged = true;
  }
}
