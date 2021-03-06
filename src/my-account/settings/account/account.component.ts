import { Component, OnInit } from '@angular/core';

import {
  FormGroup,
  AbstractControl,
  FormBuilder,
  Validators
} from '@angular/forms';


import { UserService } from '@wth/shared/services/user.service';
import { ToastsService } from '@wth/shared/shared/components/toast/toast-message.service';
import { LoadingService } from '@wth/shared/shared/components/loading/loading.service';
import { CustomValidator } from '@wth/shared/shared/validator/custom.validator';
import { WthConfirmService } from '@wth/shared/shared/components/confirmation/wth-confirm.service';
import { Constants } from '@wth/shared/constant/config/constants';

declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'my-setting-account',
  templateUrl: 'account.component.html'
})

export class MyAccountComponent implements OnInit {
  pageTitle: string = 'Account';
  errorMessage: string = Constants.errorMessage.default;

  tooltip: any = Constants.tooltip;

  formValue: any;

  form: FormGroup;
  oldPassword: AbstractControl;
  password: AbstractControl;

  submitted: boolean = false;

  constructor(private fb: FormBuilder,
              public userService: UserService,
              private toastsService: ToastsService,
              private wthConfirmService: WthConfirmService,
              private loadingService: LoadingService) {

    this.form = fb.group({
      'oldPassword': ['', Validators.compose([
        Validators.required
      ])],
      'password': ['', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        CustomValidator.lowercaseUppercase,
        CustomValidator.specialSymbolOrNumber
      ])]
    });

    this.oldPassword = this.form.controls['oldPassword'];
    this.password = this.form.controls['password'];
  }

  ngOnInit(): void {
    // Set value before updating form (checking user leave this page)
    this.formValue = this.form.value;
  }

  onSubmit(values: any): void {
    // Set value after updating form (checking user leave this page)
    this.formValue = values;

    this.submitted = true;
    if (this.form.valid) {
      let old_password = values.oldPassword;
      let password = values.password;
      // start loading
      this.loadingService.start();

      let body = JSON.stringify({
        old_password: old_password,
        password: password
      });
      this.userService.changePassword(body)
        .subscribe((result: any) => {
            // stop loading
            this.loadingService.stop();
            if (result.success) {
              this.toastsService.success(result.message);
              //console.log('change password:', result.message);
            } else {
              this.toastsService.danger(result.message);
              //console.log('change password error:', result.message);
            }
          },
          error => {
            // stop loading
            this.loadingService.stop();
            this.toastsService.danger(error.message);
            console.log('login error:', error.message);
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

  cancelPlan(): void {

    //2
    let body: string = JSON.stringify({plan_id: 1});
    let bodyText = `If you decide to leave WTHapp, it’s OK. You can keep on using WTHpictures. <br>
     We will send you a cancellation confirmation email to <span class="bold">${this.userService.getSyncProfile().email}</span>. <br>
     We are sorry to see you leave - but we will be here if you wish to rejoin. <br>`;

    this.wthConfirmService.confirm({
      message: bodyText,
      header: 'Cancel Membership',
      accept: () => {
        this.loadingService.start();
        this.userService.choosePlan(`users/${this.userService.getSyncProfile().id}`, body)
          .subscribe((response: any) => {
              this.toastsService.success(response.message);
              this.loadingService.stop();
            },
            error => {
              this.toastsService.danger(error);
              this.loadingService.stop();
            });
      }
    });
  }

  onDelete(): void {
    let bodyText = `If you don't think you will not use WTHapps again and would like to delete you account,<br>
     we will take care of that for you.<br>
     Your account adn all details will be deleted after 14 days. If you change your mind <br>
     within 14 days - log back in to restore your account
     If you still want to delete your account, click "Delete My Account". <br>`;
    let body = JSON.stringify({permanent_deleted: true});

    this.wthConfirmService.confirm({
      message: bodyText,
      header: 'Delete Account',
      accept: () => {
        this.loadingService.start();
        this.userService.update(body)
          .subscribe((response: any) => {
              this.toastsService.success(response.message);
              this.loadingService.stop();
              this.userService.logout('users/sign_out')
                .subscribe(
                  response => {
                    // this.userService.deleteUserInfo();
                    // this.appearancesChannelService.unsubscribe();
                    // this.router.navigate(['/login']);
                  },
                  error => {
                    // this.userService.deleteUserInfo();
                    // this.router.navigate(['/login']);
                    // console.log('logout error', error);
                  }
                );
            },
            error => {
              this.toastsService.danger(error);
              this.loadingService.stop();
            });
      }
    });
  }

  /**
   *
   * @returns {boolean|Promise<boolean>}
   */
  // 2 canDeactivate(): Promise<boolean> | boolean {
  //   return this.deactivateConfirmService.activate(this.formValue, this.form.value);
  // }
}
