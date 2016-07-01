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

import {
  UserService,
  User,
  CONFIG,
  LoadingService,
  TopMessageService
}                             from '../../shared/index';
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
  errorMessage:string = '';
  updateInfo:ControlGroup;
  user:User;

  birthdayDate:Object = {
    day: 0,
    month: 0,
    year: 0
  };

  sex:number;

  //dateRange:Array;

  constructor(private _userService:UserService,
              private _router:Router,
              private _loadingService:LoadingService,
              private _topMessageService:TopMessageService,
              private _builder:FormBuilder) {

    if (!this._userService.loggedIn) {
      this._router.navigateByUrl(`/login;${CONFIG.params.next}=${this._router._location.path().replace(/\//g, '\%20')}`);
    }

    this.sex = this._userService.profile.sex == null ? 0 : this._userService.profile.sex;

    if (this._userService.profile.birthday !== null) {
      let birthday = new Date(this._userService.profile.birthday);
      this.birthdayDate.day = birthday.getDate();
      this.birthdayDate.month = birthday.getMonth() + 1;
      this.birthdayDate.year = birthday.getUTCFullYear();
    }

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
      sex: [this.sex]
    });
  }

  update() {
    // start loading
    this._loadingService.start();

    this.updateInfo.value.sex = this.sex;
    this.user = this.updateInfo.value;
    console.log('data sent to server', this.user);

    let body = JSON.stringify({
      first_name: this.user.first_name,
      last_name: this.user.last_name,
      //email: this.user.email,
      password: this.user.password,
      birthday_day: this.user.birthday_day,
      birthday_month: this.user.birthday_month,
      birthday_year: this.user.birthday_year,
      sex: this.user.sex
    });
    console.log('update:', body);
    this._userService.update(`users/${this._userService.profile.id}`, body)
      .subscribe((result) => {
          // stop loading
          this._loadingService.stop();
          this._topMessageService.success(result.message);
        },
        error => {
          // stop loading
          this._loadingService.stop();
          this._topMessageService.danger(result.message);
          console.log('login error:', error.message);
        }
      );

  }

}
