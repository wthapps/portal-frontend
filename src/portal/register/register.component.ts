import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HandleReCaptchaMixin } from '@portal/shared/mixins/handle-login-recaptcha.mixin';
import { Mixins } from '@shared/design-patterns/decorator/mixin-decorator';
import { Constants } from '../../shared/constant/config/constants';

import { UserService } from '../../shared/services/user.service';
import { LoadingService } from '../../shared/shared/components/loading/loading.service';
import { CustomValidator } from '../../shared/shared/validator/custom.validator';
import { environment } from '@env/environment';

declare var $: any;

/**
 * This class represents the lazy loaded RegisterComponent.
 */
@Component({
  selector: 'page-register',
  templateUrl: 'register.component.html',
  styleUrls: ['register.component.scss']
})
@Mixins([HandleReCaptchaMixin])
export class RegisterComponent implements HandleReCaptchaMixin {
  errorMessage = '';
  sex = 0;

  tooltip: any = Constants.tooltip;

  form: FormGroup;
  first_name: AbstractControl;
  last_name: AbstractControl;
  email: AbstractControl;
  password: AbstractControl;
  birthday_day: AbstractControl;
  birthday_month: AbstractControl;
  birthday_year: AbstractControl;
  accepted: AbstractControl;

  submitted = false;
  invitationUuid: string;
  notRobot: boolean = false;
  siteKey = environment.keys.recaptcha_site_key;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private loadingService: LoadingService
  ) {
    /*if (this.userService.loggedIn) {
     this.router.navigateByUrl('/account/setting/dashboard');
     }*/

    this.form = fb.group({
      first_name: ['', Validators.compose([Validators.required, CustomValidator.blanked])],
      last_name: ['', Validators.compose([Validators.required, CustomValidator.blanked])],
      email: [
        '',
        Validators.compose([Validators.required, CustomValidator.emailFormat])
      ],
      password: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
          CustomValidator.lowercaseUppercase,
          CustomValidator.specialSymbolOrNumber
        ])
      ],
      accepted: [false, Validators.compose([Validators.nullValidator])]
    });

    this.first_name = this.form.controls['first_name'];
    this.last_name = this.form.controls['last_name'];
    this.email = this.form.controls['email'];
    this.password = this.form.controls['password'];
    this.accepted = this.form.controls['accepted'];

    this.route.queryParams.subscribe((queryParam: any) => {
      this.invitationUuid = queryParam['invitation'];
    });
  }

  handleCaptcha: (event: any) => void;
  handleCaptchaExpire: (event: any) => void;

  onSubmit(values: any): void {
    this.submitted = true;
    if (this.form.valid) {
      // start loading
      this.loadingService.start();

      values.sex = this.sex;

      const body = JSON.stringify({
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        password: values.password,
        sex: values.sex,
        invitation_uuid: this.invitationUuid,
        accepted_policies: values.accepted === true ? true : false
      });

      this.userService.signup('users', body).subscribe(
        result => {
          this.loadingService.stop();
          window.location.href = Constants.baseUrls.myAccount + `/users/alert?alertType=signup`;
        },
        error => {
          // stop loading
          this.loadingService.stop();

          const err = error;

          this.errorMessage = err.error.error;
          if (error.status === 422) {
            this.errorMessage = 'Email has already been taken';
          }
        }
      );
    }
  }
}
