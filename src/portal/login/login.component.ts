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

  flagsRelease: boolean = Constants.flagsRelease;

  tooltip: any = Constants.tooltip;

  private returnUrl: string;

  constructor(private fb: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              private userService: UserService,
              private toastsService: ToastsService,
              private loadingService: LoadingService,
              private appearancesChannelService: AppearancesChannelService,
              private ng2Cable: Ng2Cable,
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

      // this.returnUrl = this.route.snapshot.queryParams['returnUrl'];
      this.userService.login('users/sign_in', body)
        .subscribe((result) => {
            if (result) {
              // Initialize websocket
              // this.appearancesChannelService.subscribe();
              // this.chatSupportAppearanceChannel.subscribe();

              if (this.flagsRelease) {
                window.location.href = Constants.urls.afterLogin;
              } else {
                // Redirect to previous url
                if (this.returnUrl == undefined) {
                  this.returnUrl = (this.userService.getSyncProfile() && this.userService.getSyncProfile().took_a_tour) ? '' : Constants.baseUrls.myAccount;
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
}
