import {Component, OnInit}          from '@angular/core';
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
  CustomValidator,
  Constants,
  CountryService,
  UploadCropImageComponent
}                           from '../../shared/index';

declare var $: any;

@Component({
  moduleId: module.id,
  templateUrl: 'profile.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    REACTIVE_FORM_DIRECTIVES,
    UploadCropImageComponent
  ],
  providers: [
    CountryService
  ]
})

export class ProfileComponent implements OnInit {
  pageTitle: string = 'Profile';
  errorMessage: string = Constants.errorMessage.default;

  imgAvatar: string = Constants.img.avatar;

  sex: number = 0;
  birthdayDate: any = {
    day: 0,
    month: 0,
    year: 0
  };

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
              private _userService: UserService,
              private _toastsService: ToastsService,
              private _loadingService: LoadingService) {

    this.imgAvatar = this._userService.profile.profile_image ? this._userService.profile.profile_image : this.imgAvatar;
    this.sex = this._userService.profile.sex === null ? 0 : this._userService.profile.sex;

    if (this._userService.profile.birthday !== null) {
      let birthday = new Date(this._userService.profile.birthday);
      this.birthdayDate.day = birthday.getDate();
      this.birthdayDate.month = birthday.getMonth() + 1;
      this.birthdayDate.year = birthday.getUTCFullYear();
    }

    this.form = fb.group({
      'first_name': [this._userService.profile.first_name,
        Validators.compose([Validators.required])
      ],
      'last_name': [this._userService.profile.last_name,
        Validators.compose([Validators.required])
      ],
      'email': [this._userService.profile.email,
        Validators.compose([Validators.required, CustomValidator.emailFormat])
      ],
      'phone_prefix': [this._userService.profile.nationality],
      'phone_number': [this._userService.profile.phone_number],
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
    this.countryService.getCountries().subscribe(
      data => this.countriesCode = data,
      error => this.errorMessage = <any>error);
  }

  onSubmit(values: any): void {
    this.submitted = true;

    if (this.form.valid) {
      // start loading
      this._loadingService.start();

      values.sex = this.sex;

      let body = JSON.stringify({
        first_name: values.first_name,
        last_name: values.last_name,
        nationality: values.phone_prefix,
        phone_number: values.phone_number,
        birthday_day: values.birthday_day.toString(),
        birthday_month: values.birthday_month.toString(),
        birthday_year: values.birthday_year.toString(),
        sex: values.sex
      });

      //console.log(body);

      this._userService.update(`users/${this._userService.profile.id}`, body)
        .subscribe((result: any) => {
            // stop loading
            this._loadingService.stop();
            this._toastsService.success(result.message);
          },
          error => {
            // stop loading
            this._loadingService.stop();
            this._toastsService.danger(this.errorMessage);
            console.log(error);
          }
        );
    }
  }

  uploadImage(event): void {
    event.preventDefault();
    $('#modalUploadImage').modal('show');
  }
}
