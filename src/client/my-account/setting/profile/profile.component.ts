import { Component, OnInit }    from '@angular/core';
import 'rxjs/add/observable/fromPromise';

import {
  FormGroup,
  AbstractControl,
  FormBuilder,
  Validators
} from '@angular/forms';

import { Constants } from '../../../core/shared/config/constants';
import { CustomValidator } from '../../../core/shared/validator/custom.validator';
import { UserService } from '../../../core/shared/services/user.service';

import { CountryService } from '../../../core/partials/countries/countries.service';
import { ToastsService } from '../../../core/partials/toast/toast-message.service';
import { LoadingService } from '../../../core/partials/loading/loading.service';

declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'ac-setting-profile',
  templateUrl: 'profile.component.html'
})

export class ACProfileComponent implements OnInit {
  pageTitle: string = 'Profile';
  errorMessage: string = Constants.errorMessage.default;
  profile_image: string = '';

  sex: number = 0;
  birthdayDate: any = {
    day: 0,
    month: 0,
    year: 0
  };

  formValue: any;

  countriesCode: any;

  form: FormGroup;
  first_name: AbstractControl;
  last_name: AbstractControl;
  email: AbstractControl;
  phone_prefix: AbstractControl;
  phone_number: AbstractControl;
  birthday_day: AbstractControl;
  birthday_month: AbstractControl;
  birthday_year: AbstractControl;

  submitted: boolean = false;

  constructor(private fb: FormBuilder,
              private countryService: CountryService,
              private userService: UserService,
              private toastsService: ToastsService,
              private loadingService: LoadingService,
              //2 private deactivateConfirmService: DeactivateConfirmService,
              ) {

    this.sex = this.userService.profile.sex === null ? 0 : this.userService.profile.sex;

    if (!this.userService.profile.profile_image) {
      this.userService.profile.profile_image = Constants.img.avatar;
    }

    if (this.userService.profile.birthday !== null) {
      let birthday = new Date(this.userService.profile.birthday);
      this.birthdayDate.day = birthday.getDate();
      this.birthdayDate.month = birthday.getMonth() + 1;
      this.birthdayDate.year = birthday.getUTCFullYear();
    }

    this.form = fb.group({
      'first_name': [this.userService.profile.first_name,
        Validators.compose([Validators.required])
      ],
      'last_name': [this.userService.profile.last_name,
        Validators.compose([Validators.required])
      ],
      'email': [
        {value: this.userService.profile.email, disabled: true},
        Validators.compose([Validators.required, CustomValidator.emailFormat])
      ],
      'phone_prefix': [this.userService.profile.nationality],
      'phone_number': [this.userService.profile.phone_number],
      'birthday_day': [this.birthdayDate.day],
      'birthday_month': [this.birthdayDate.month],
      'birthday_year': [this.birthdayDate.year]
    });

    this.first_name = this.form.controls['first_name'];
    this.last_name = this.form.controls['last_name'];
    this.email = this.form.controls['email'];
    this.phone_prefix = this.form.controls['phone_prefix'];
    this.phone_number = this.form.controls['phone_number'];
    this.birthday_day = this.form.controls['birthday_day'];
    this.birthday_month = this.form.controls['birthday_month'];
    this.birthday_year = this.form.controls['birthday_year'];
  }

  ngOnInit(): void {
    // Set value before updating form (checking user leave this page)
    this.formValue = this.form.value;

    this.profile_image = this.userService.profile.profile_image;
    this.countryService.getCountries().subscribe(
      data => this.countriesCode = data,
      error => this.errorMessage = <any>error);
  }

  onSubmit(values: any): void {
    // Set value after updating form (checking user leave this page)
    this.formValue = values;

    this.submitted = true;

    if (this.form.valid) {
      // start loading
      this.loadingService.start();

      values.sex = this.sex;

      let body = JSON.stringify({
        first_name: values.firstName,
        last_name: values.lastName,
        nationality: values.phone_prefix,
        phone_number: values.phone_number,
        birthday_day: values.birthday_day.toString(),
        birthday_month: values.birthday_month.toString(),
        birthday_year: values.birthday_year.toString(),
        sex: values.sex
      });

      //console.log(body);

      this.userService.update(`users/${this.userService.profile.id}`, body)
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

  uploadImage(event: any): void {
    event.preventDefault();
    $('#modalUploadImage').modal('show');
  }

  onImageClicked(img: string): void {

    let body = JSON.stringify({image: img});
    this.userService.update(`users/${this.userService.profile.id}`, body)
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


  /**
   *
   * @returns {boolean|Promise<boolean>}
   */
  //2 canDeactivate(): Promise<boolean> | boolean {
  //   return this.deactivateConfirmService.activate(this.formValue, this.form.value);
  // }
}
