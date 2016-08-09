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
  CustomValidator,
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
  pageTitle:string = 'Preferences';
  errorMessage:string = Constants.errorMessage.default;
  sex:number = 0;
  birthdayDate:any = {
    day: 0,
    month: 0,
    year: 0
  };

  form:FormGroup;
  first_name:AbstractControl;
  last_name:AbstractControl;
  email:AbstractControl;
  birthday_day:AbstractControl;
  birthday_month:AbstractControl;
  birthday_year:AbstractControl;

  submitted:boolean = false;

  constructor(private fb:FormBuilder,
              private _userService:UserService,
              private _toastsService:ToastsService,
              private _loadingService:LoadingService) {


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
      'birthday_day': [this.birthdayDate.day],
      'birthday_month': [this.birthdayDate.month],
      'birthday_year': [this.birthdayDate.year]
    });

    this.first_name = this.form.controls['first_name'];
    this.last_name = this.form.controls['last_name'];
    this.email = this.form.controls['email'];
    this.birthday_day = this.form.controls['birthday_day'];
    this.birthday_month = this.form.controls['birthday_month'];
    this.birthday_year = this.form.controls['birthday_year'];
  }

  onSubmit(values:any):void {
    this.submitted = true;
    if (this.form.valid) {
      // start loading
      this._loadingService.start();

      values.sex = this.sex;

      let body = JSON.stringify({
        first_name: values.first_name,
        last_name: values.last_name,
        birthday_day: values.birthday_day,
        birthday_month: values.birthday_month,
        birthday_year: values.birthday_year,
        sex: values.sex
      });

      this._userService.update(`users/${this._userService.profile.id}`, body)
        .subscribe((result:any) => {
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
}
