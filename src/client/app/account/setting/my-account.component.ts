import {Component}            from '@angular/core';
import {
  ROUTER_DIRECTIVES,
  Router
}                             from '@angular/router';

import {
  FORM_DIRECTIVES,
  FormBuilder,
  ControlGroup,
  Validators
}                             from '@angular/common';

import {UserService, CONFIG}  from '../../shared/index';
import {CustomValidators}     from '../../shared/validator/custom-validators';

@Component({
  moduleId: module.id,
  templateUrl: 'my-account.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    FORM_DIRECTIVES
  ],
  providers: [
    UserService
  ]
})

export class MyAccountComponent {
  pageTitle:string = 'Account setting';

  updateInfo:ControlGroup;

  birthdayDate:Object = {
    day: 0,
    month: 0,
    year: 0
  };

  sex:number;

  //dateRange:Array;

  constructor(private _userService:UserService,
              private _router:Router,
              private _builder:FormBuilder) {

    if (!this._userService.loggedIn) {
      this._router.navigateByUrl(`/login;${CONFIG.params.next}=${this._router._location.path().replace(/\//g, '\%20')}`);
    }

    console.log(this._userService.profile);

    this.sex = this._userService.profile.sex;

    if (this._userService.profile.birthday !== null) {
      let birthday = new Date(this._userService.profile.birthday);
      this.birthdayDate.day = birthday.getDate();
      this.birthdayDate.month = birthday.getMonth();
      this.birthdayDate.year = birthday.getUTCFullYear();
    }
    console.log(this.birthdayDate.day, this.birthdayDate.month, this.birthdayDate.year);

    this.updateInfo = this._builder.group({
      first_name: [this._userService.profile.first_name,
        Validators.required
      ],
      last_name: [this._userService.profile.last_name,
        Validators.required
      ],
      email: [this._userService.profile.email,
        Validators.compose([Validators.required, CustomValidators.emailFormat]),
        CustomValidators.duplicated
      ],
      birthday_day: [this.birthdayDate.day],
      birthday_month: [this.birthdayDate.month],
      birthday_year: [this.birthdayDate.year],
      sex: [],
    });

  }

}
