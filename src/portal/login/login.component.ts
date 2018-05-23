import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl
} from '@angular/forms';

import { AppearancesChannelService } from '../../shared/channels/appearances-channel.service';
import { UserService } from '../../shared/services/user.service';
import { AuthService } from '../../shared/services/auth.service';
import { CustomValidator } from '../../shared/shared/validator/custom.validator';
import { ToastsService } from '../../shared/shared/components/toast/toast-message.service';
import { LoadingService } from '../../shared/shared/components/loading/loading.service';
import { Constants } from '../../shared/constant/config/constants';
import { Ng2Cable } from 'ng2-cable';

declare var $: any;

/**
 * This class represents the lazy loaded LoginComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'page-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  email: AbstractControl;
  password: AbstractControl;
  submitted: boolean = false;

  tooltip: any = Constants.tooltip;

  private returnUrl: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private toastsService: ToastsService,
    private loadingService: LoadingService,
    private appearancesChannelService: AppearancesChannelService,
    private ng2Cable: Ng2Cable,
    private authService: AuthService
  ) {
    this.form = fb.group({
      email: [
        '',
        Validators.compose([Validators.required, CustomValidator.emailFormat])
      ],
      password: ['', Validators.compose([Validators.required])]
    });

    this.email = this.form.controls['email'];
    this.password = this.form.controls['password'];
  }

  ngOnInit() {
    this.loadingService.stop();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';
  }

  onSubmit(values: any): void {
    this.submitted = true;
    if (this.form.valid) {
      // start loading
      this.loadingService.start();

      let email = values.email;
      let password = values.password;
      let body = JSON.stringify({ user: { email, password } });

      this.authService.login(body).subscribe(
        (response: any) => {
          this.loadingService.stop();
          this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';
          if (this.returnUrl.indexOf(Constants.baseUrls.app) >= 0) {
            this.router.navigate([this.returnUrl]);
          } else {
            if (this.returnUrl === '' && Constants.useDefaultPage) {
              window.location.href = Constants.urls.default;
            } else if (this.returnUrl === '' && !Constants.useDefaultPage) {
              this.router.navigate(['']);
            } else {
              window.location.href = this.returnUrl;
            }
          }
        },
        (error: any) => {
          // stop loading
          this.loadingService.stop();
          this.toastsService.danger(error.error.error);
        }
      );
    }
  }
}
