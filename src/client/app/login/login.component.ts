import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl
} from '@angular/forms';

import { ToastsService } from '../../core/partials/toast/toast-message.service';
import { LoadingService } from '../../core/partials/loading/loading.service';
import { AppearancesChannelService } from '../../core/shared/channels/appearances-channel.service';
import { UserService } from '../../core/shared/services/user.service';
import { AuthService } from '../../core/shared/services/auth.service';
import { CustomValidator } from '../../core/shared/validator/custom.validator';
import { Constants } from '../../core/shared/config/constants';

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

  flagsRelease: boolean = Constants.flagsRelease;

  private returnUrl: string;

  constructor(private fb: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              private userService: UserService,
              private toastsService: ToastsService,
              private loadingService: LoadingService,
              private appearancesChannelService: AppearancesChannelService,
              private authService: AuthService) {
    // if (this.userService.loggedIn) {
    //   this.router.navigate(['/account/setting/profile']);
    // }

    if (this.userService.loggedIn && this.flagsRelease) {
      window.location.href = Constants.urls.afterLogin;
    }

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

      this.returnUrl = this.route.snapshot.queryParams['returnUrl'];
      this.userService.login('users/sign_in', body)
        .subscribe((result) => {
            if (result) {
              this.loadingService.stop();

              // Initialize websocket
              this.appearancesChannelService.subscribe();


              if (this.flagsRelease) {
                window.location.href = Constants.urls.afterLogin;
              } else {
                // Redirect to previous url
                if (this.returnUrl == undefined) {
                  this.returnUrl = '';
                }
                window.location.href = this.returnUrl;

                // TODO Store payment info
              }

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
