import {Component}          from '@angular/core';
import {
  ROUTER_DIRECTIVES
}                           from '@angular/router';
import {
  REACTIVE_FORM_DIRECTIVES,
  FormGroup,
  AbstractControl,
  FormBuilder,
  Validators
}                           from '@angular/forms';

import {
  UserService,
  ToastsService,
  LoadingService,
  CustomValidator,
  Constants,
  DialogService
}                           from '../../shared/index';

declare var $: any;

@Component({
  moduleId: module.id,
  templateUrl: 'my-account.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    REACTIVE_FORM_DIRECTIVES
  ]
})

export class MyAccountComponent {
  pageTitle: string = 'Account';
  errorMessage: string = Constants.errorMessage.default;

  public form: FormGroup;
  public oldPassword: AbstractControl;
  public password: AbstractControl;

  public submitted: boolean = false;

  constructor(private fb: FormBuilder,
              private userService: UserService,
              private toastsService: ToastsService,
              private dialogService: DialogService,
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

  public onSubmit(values: any): void {
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
      this.userService.changePassword(`users/${this.userService.profile.id}`, body)
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

  hideShowPassword(event): void {
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
    let bodyText = `If you decide to leave WTHapp, it’s OK. You can keep on using WTHpictures. <br>
      We will send you a cancellation confirmation email to <span class="bold">${this.userService.profile.email}</span>. <br>
      We are sorry to see you leave - but we will be here if you wish to rejoin. <br>`;
    this.dialogService.activate(bodyText, 'Cancel Membership', 'Finish Cancellation', 'Cancel');
  }
}
