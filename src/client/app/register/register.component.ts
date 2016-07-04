import {Component}          from '@angular/core';
import {
  ROUTER_DIRECTIVES,
  Router
}                           from '@angular/router';
import {
  FORM_DIRECTIVES,
  FormBuilder,
  ControlGroup,
  Validators
}                           from '@angular/common';
import {CustomValidators}   from '../shared/validator/custom-validators';
import {
  LoadingService,
  ToastsService,
  UserService, User
}                           from '../shared/index';

@Component({
  moduleId: module.id,
  templateUrl: 'register.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    FORM_DIRECTIVES
  ]
})

export class RegisterComponent {
  pageTitle:string = 'Register page';

  user:User;
  singupForm:ControlGroup;

  sex:number = 0;
  errorMessage:string = '';

  constructor(private _userService:UserService,
              private _toastsService:ToastsService,
              private _loadingService:LoadingService,
              private _router:Router,
              private _builder:FormBuilder) {

    // if (this._userService.loggedIn) {
    //   this._router.navigateByUrl('/');
    // }

    this.singupForm = this._builder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      birthday_day: ['0'],
      birthday_month: ['0'],
      birthday_year: ['0'],
      sex: [],
      accepted: [],
      email: ['',
        Validators.compose([Validators.required, CustomValidators.emailFormat]),
        CustomValidators.duplicated
      ],
      password: ['',
        Validators.compose([Validators.required, Validators.minLength(6)])
      ]
    });
  }

  signup() {
    // start loading
    this._loadingService.start();

    this.singupForm.value.sex = this.sex;
    this.user = this.singupForm.value;
    //console.log('data sent to server', this.user);

    let body = JSON.stringify({
      first_name: this.user.first_name,
      last_name: this.user.last_name,
      email: this.user.email,
      password: this.user.password,
      birthday_day: this.user.birthday_day,
      birthday_month: this.user.birthday_month,
      birthday_year: this.user.birthday_year,
      sex: this.user.sex,
      accepted_policies: this.singupForm.value.accepted === true ? true : false
    });
    //console.log(body);
    this._userService.signup('users', body)
      .subscribe((result) => {
          // stop loading
          this._loadingService.stop();
          this._router.navigateByUrl('/welcome');
        },
        error => {
          console.log('error:', error);
          let err = JSON.stringify(error._body);

          this.errorMessage = err;
          //TODO refactoring code check signup
          if (error.status === 422) {
            this.errorMessage = 'Email has already been taken';
          }
          this._toastsService.danger(this.errorMessage);

          // stop loading
          this._loadingService.stop();
        });
  }
}
