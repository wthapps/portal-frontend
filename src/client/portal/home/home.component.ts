import { Component, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';

import { Constants } from '../../core/shared/config/constants';
import { fadeInAnimation } from '../../core/shared/animations/route.animation';
import { Errors } from '../../core/shared/models/errors.model';
import { UserService } from '../../core/shared/services/user.service';
import { ToastsService } from '../../core/shared/components/toast/toast-message.service';
import { LoadingService } from '../../core/shared/components/loading/loading.service';
import { CustomValidator } from '../../core/shared/validator/custom.validator';
/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css'],
  animations: [fadeInAnimation]
})
export class HomeComponent {
  @HostBinding('@fadeInAnimation') fadeInAnimation = true;

  errorMessage: any;

  flagsRelease: boolean = Constants.flagsRelease;

  tooltip: any = Constants.tooltip;

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

  constructor(private router: Router,
              private fb: FormBuilder,
              private userService: UserService,
              private toastsService: ToastsService,
              private loadingService: LoadingService) {
    if (this.flagsRelease) {
      this.router.navigate(['/login']);
    }

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
  }

  gotoHashtag(link: string, prodID: string) {
    this.router.navigate([`${link}`], {fragment: prodID});
    return false;
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
            window.location.href = Constants.baseUrls.myAccount;
            // this.router.navigateByUrl('/welcome');
          },
          error => {
            // stop loading
            this.loadingService.stop();

            console.log('error:', error);
            let err: any = error;

            this.errorMessage = err;
            //TODO refactoring code check signup
            if (error.status === 422) {
              this.errorMessage = 'Email has already been taken';
            }
            this.toastsService.danger(this.errorMessage);

          });
    }
  }
}
