import {Component}          from '@angular/core';
import {
  ROUTER_DIRECTIVES,
  Router
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
  CustomValidator
}                           from '../shared/index';

declare var $: any;

@Component({
  moduleId: module.id,
  templateUrl: 'register.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    REACTIVE_FORM_DIRECTIVES
  ]
})

export class RegisterComponent {
  errorMessage: string = '';
  sex: number = 0;

  form: FormGroup;
  first_name: AbstractControl;
  last_name: AbstractControl;
  email: AbstractControl;
  password: AbstractControl;
  birthday_day: AbstractControl;
  birthday_month: AbstractControl;
  birthday_year: AbstractControl;
  //sexInput:AbstractControl;
  accepted: AbstractControl;

  submitted: boolean = false;

  constructor(private fb: FormBuilder,
              private _router: Router,
              private _userService: UserService,
              private _toastsService: ToastsService,
              private _loadingService: LoadingService) {

    /*if (this._userService.loggedIn) {
     this._router.navigateByUrl('/account/setting/dashboard');
     }*/

    this.form = fb.group({
      'first_name': ['',
        Validators.compose([Validators.required])
      ],
      'last_name': ['',
        Validators.compose([Validators.required])
      ],
      'email': ['',
        Validators.compose([Validators.required, CustomValidator.emailFormat])
      ],
      'password': ['',
        Validators.compose([Validators.required, Validators.minLength(8)])
      ],
      'birthday_day': ['0'],
      'birthday_month': ['0'],
      'birthday_year': ['0'],
      //'sex': [],
      'accepted': [false, Validators.compose([Validators.nullValidator])]
    });

    this.first_name = this.form.controls['first_name'];
    this.last_name = this.form.controls['last_name'];
    this.email = this.form.controls['email'];
    this.password = this.form.controls['password'];
    this.birthday_day = this.form.controls['birthday_day'];
    this.birthday_month = this.form.controls['birthday_month'];
    this.birthday_year = this.form.controls['birthday_year'];
    //this.sexInput = this.form.controls['sex'];
    this.accepted = this.form.controls['accepted'];
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
        email: values.email,
        password: values.password,
        birthday_day: values.birthday_day,
        birthday_month: values.birthday_month,
        birthday_year: values.birthday_year,
        sex: values.sex,
        accepted_policies: values.accepted === true ? true : false
      });

      this._userService.signup('users', body)
        .subscribe((result) => {
            this._loadingService.stop();
            this._router.navigateByUrl('/welcome');
          },
          error => {
            // stop loading
            this._loadingService.stop();

            console.log('error:', error);
            let err = JSON.stringify(error._body);

            this.errorMessage = err;
            //TODO refactoring code check signup
            if (error.status === 422) {
              this.errorMessage = 'Email has already been taken';
            }
            this._toastsService.danger(this.errorMessage);

          });
    }
  }

  hideShowPassword(event): void {
    var target = event.target || event.srcElement || event.currentTarget;
    let inputPass = $(target).prev();
    if (inputPass.attr('type') == 'password') {
      inputPass.attr('type', 'text');
      $(target).addClass('active');
    } else {
      inputPass.attr('type', 'password');
      $(target).removeClass('active');
    }
  }
}
