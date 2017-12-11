import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';

import { UserService } from '../../shared/shared/services/user.service';
import { CustomValidator } from '../../shared/shared/validator/custom.validator';
import { ToastsService } from '../../shared/shared/components/toast/toast-message.service';
import { LoadingService } from '../../shared/shared/components/loading/loading.service';
import { Constants } from '../../shared/constant/config/constants';

declare var $: any;

/**
 * This class represents the lazy loaded RegisterComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'page-register',
  templateUrl: 'register.component.html',
  styleUrls: ['register.component.scss']
})
export class RegisterComponent {
  errorMessage: string = '';
  sex: number = 0;

  tooltip: any = Constants.tooltip;

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
  invitationUuid: string;

  constructor(private fb: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
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

    this.route.queryParams.subscribe((queryParam: any) => {
      this.invitationUuid = queryParam['invitation'];
    });
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
        invitation_uuid: this.invitationUuid,
        accepted_policies: values.accepted === true ? true : false
      });

      this.userService.signup('users', body)
        .subscribe((result) => {
            this.loadingService.stop();
            // this.router.navigateByUrl('/welcome');
            window.location.href = Constants.baseUrls.myAccount;
          },
          error => {
            // stop loading
            this.loadingService.stop();

            console.log('error:', error);
            let err = error;

            this.errorMessage = err.error;
            //TODO refactoring code check signup
            if (error.status === 422) {
              this.errorMessage = 'Email has already been taken';
            }
            this.toastsService.danger(this.errorMessage);

          });
    }
  }
}
