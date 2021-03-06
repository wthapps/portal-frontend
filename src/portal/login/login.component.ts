import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AppearancesChannelService } from '../../shared/channels/appearances-channel.service';
import { Constants } from '../../shared/constant/config/constants';
import { AuthService } from '../../shared/services/auth.service';
import { UserService } from '../../shared/services/user.service';
import { LoadingService } from '../../shared/shared/components/loading/loading.service';
import { CustomValidator } from '../../shared/shared/validator/custom.validator';


/**
 * This class represents the lazy loaded LoginComponent.
 */
@Component({
  selector: 'page-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  email: AbstractControl;
  password: AbstractControl;
  submitted = false;
  errorMessage: string;

  tooltip: any = Constants.tooltip;

  private returnUrl: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private loadingService: LoadingService,
    private appearancesChannelService: AppearancesChannelService,
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

    // Force redirect if user cookie still valid
    if (this.userService.validProfile()) {
      this.redirectAfterLogin();
    }
  }

  onSubmit(values: any): void {
    this.submitted = true;
    if (this.form.valid) {
      // start loading
      this.loadingService.start();

      const email = values.email;
      const password = values.password;
      const body = JSON.stringify({ user: { email, password } });

      this.authService.login(body).subscribe(
        (response: any) => {
          this.loadingService.stop();
          this.redirectAfterLogin();
        },
        (error: any) => {
          // stop loading
          this.loadingService.stop();
          this.errorMessage = error.error.error;
        }
      );
    }
  }

  private redirectAfterLogin() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';
    if (this.returnUrl.indexOf(Constants.baseUrls.app) >= 0) {
      this.router.navigate([this.returnUrl]);
    } else {
      if (this.returnUrl === '' && Constants.useDefaultPage) {
        location.href = Constants.urls.default;
      } else if (this.returnUrl === '' && !Constants.useDefaultPage) {
        this.router.navigate(['']);
      } else {
        location.href = this.returnUrl;
      }
    }
  }
}
