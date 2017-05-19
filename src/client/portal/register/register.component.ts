import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';

import { UserService } from '../../core/shared/services/user.service';
import { ToastsService } from '../../core/partials/toast/toast-message.service';
import { LoadingService } from '../../core/partials/loading/loading.service';
import { CustomValidator } from '../../core/shared/validator/custom.validator';

declare var $: any;

/**
 * This class represents the lazy loaded RegisterComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'page-register',
  templateUrl: 'register.component.html'
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
              private router: Router,
              private userService: UserService,
              private toastsService: ToastsService,
              private loadingService: LoadingService) {

    /*if (this.userService.loggedIn) {
     this.router.navigateByUrl('/account/setting/dashboard');
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
      'password': ['', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        CustomValidator.lowercaseUppercase,
        CustomValidator.specialSymbolOrNumber
      ])],
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
    this.accepted = this.form.controls['accepted'];
  }

  onSubmit(values: any): void {
    this.submitted = true;
    if (this.form.valid) {
      // start loading
      this.loadingService.start();

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

      this.userService.signup('users', body)
        .subscribe((result) => {
            this.loadingService.stop();
            this.router.navigateByUrl('/welcome');
          },
          error => {
            // stop loading
            this.loadingService.stop();

            console.log('error:', error);
            let err = error;

            this.errorMessage = err;
            //TODO refactoring code check signup
            if (error.status === 422) {
              this.errorMessage = 'Email has already been taken';
            }
            this.toastsService.danger(this.errorMessage);

          });
    }
  }

  hideShowPassword(event: any): void {
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
