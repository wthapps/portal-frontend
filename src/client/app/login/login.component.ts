import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl
} from '@angular/forms';

import { CustomValidator } from '../shared/validator/custom.validator';

import { AppearancesChannelService } from '../shared/channels/appearances-channel.service';
import { UserService } from '../shared/services/user.service';
import { ToastsService } from '../partials/toast/toast-message.service';
import { LoadingService } from '../partials/loading/loading.service';
import { AuthService } from '../shared/services/auth.service';

declare var $: any;

/**
 * This class represents the lazy loaded LoginComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'page-login',
  templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  email: AbstractControl;
  password: AbstractControl;
  submitted: boolean = false;

  constructor(private fb: FormBuilder,
              private router: Router,
              private userService: UserService,
              private toastsService: ToastsService,
              private loadingService: LoadingService,
              private appearancesChannelService: AppearancesChannelService,
              private authService: AuthService) {
    // if (this.userService.loggedIn) {
    //   this.router.navigate(['/account/setting/profile']);
    // }

    this.form = fb.group({
      'email': ['',
        Validators.compose([Validators.required, CustomValidator.emailFormat])
      ],
      'password': ['',
        Validators.compose([Validators.required])
      ]
    });

    this.email = this.form.controls['email'];
    this.password = this.form.controls['password'];
  }

  ngOnInit() {
    this.loadingService.stop();
  }

  onSubmit(values: any): void {

    this.submitted = true;
    if (this.form.valid) {
      // start loading
      this.loadingService.start();

      let email = values.email;
      let password = values.password;

      let body = JSON.stringify({user: {email, password}});
      this.userService.login('users/sign_in', body)
        .subscribe((result) => {
            if (result) {
              this.loadingService.stop();

              // Get the redirect URL from our auth service
              // If no redirect has been set, use the default
              let redirect = this.authService.redirectUrl ? this.authService.redirectUrl : '/account/my-apps';

              // Set our navigation extras object
              // that passes on our global query params and fragment
              let navigationExtras: NavigationExtras = {
                preserveQueryParams: true,
                preserveFragment: true
              };
              this.appearancesChannelService.subscribe();
              // Redirect the user
              this.router.navigate([redirect], navigationExtras);

              // Store payment info


            }
          },
          error => {
            // stop loading
            this.loadingService.stop();

            this.toastsService.danger('Invalid email or password');
            //console.log('login error:', error);
          }
        );
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
