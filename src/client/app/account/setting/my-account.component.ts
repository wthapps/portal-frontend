import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import { Router } from '@angular/router';
import {
  FormGroup,
  AbstractControl,
  FormBuilder,
  Validators
}                           from '@angular/forms';

import {
  UserService,
  ToastsService,
  //2 LoadingService,
  CustomValidator,
  Constants,
  //2 DialogService,
  ApiBaseService
}                           from '../../shared/index';

declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  templateUrl: 'my-account.component.html'
})

export class MyAccountComponent implements OnInit {
  pageTitle: string = 'Account';
  errorMessage: string = Constants.errorMessage.default;

  formValue: any;

  form: FormGroup;
  oldPassword: AbstractControl;
  password: AbstractControl;

  submitted: boolean = false;

  constructor(private fb: FormBuilder,
              private userService: UserService,
              private toastsService: ToastsService,
              //2 private dialogService: DialogService,
              //2 private loadingService: LoadingService,
              private apiService: ApiBaseService,
              private router: Router) {

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
      //2 this.loadingService.start();

      let body = JSON.stringify({
        old_password: old_password,
        password: password
      });
      this.userService.changePassword(`users/${this.userService.profile.id}`, body)
        .subscribe((result: any) => {
            // stop loading
            //2 this.loadingService.stop();
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
            //2 this.loadingService.stop();
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
    /*let body: string = JSON.stringify({plan_id: 1});
     let bodyText = `If you decide to leave WTHapp, it’s OK. You can keep on using WTHpictures. <br>
     We will send you a cancellation confirmation email to <span class="bold">${this.userService.profile.email}</span>. <br>
     We are sorry to see you leave - but we will be here if you wish to rejoin. <br>`;
     this.dialogService.activate(bodyText, 'Cancel Membership', 'Finish Cancellation', 'Cancel')
     .then((responseOK) => {
     if (responseOK) {
     this.loadingService.start();
     this.userService.choosePlan(`users/${this.userService.profile.id}`, body)
     .subscribe((response: any) => {
     this.toastsService.success(response.message);
     this.loadingService.stop();
     },
     error => {
     this.toastsService.danger(error);
     this.loadingService.stop();
     });
     }
     });*/
  }

  delete(): void {
    //2
    /*let bodyText = `If you don't think you will not use WTHapps again and would like to delete you account,<br>
     we will take care of that for you.<br>
     Your account adn all details will be deleted after 14 days. If you change your mind <br>
     within 14 days - log back in to restore your account
     If you still want to delete your account, click "Delete My Account". <br>`;
     let body = JSON.stringify({permanent_deleted: true});
     this.dialogService.activate(bodyText, 'Delete Account', 'Delete My Account', 'Cancel')
     .then((responseOK) => {
     if (responseOK) {
     this.loadingService.start();
     this.userService.update(`users/${this.userService.profile.id}`, body)
     .subscribe((response: any) => {
     this.toastsService.success(response.message);
     this.loadingService.stop();
     this.userService.logout('users/sign_out')
     .subscribe(
     response => {
     this.userService.deleteUserInfo();
     this.router.navigate(['/login']);
     },
     error => {
     this.userService.deleteUserInfo();
     this.router.navigate(['/login']);
     console.log('logout error', error);
     }
     );
     },
     error => {
     this.toastsService.danger(error);
     this.loadingService.stop();
     });
     }
     });*/
  }


  /**
   *
   * @returns {any}
   */
  //2
  /*canDeactivate(): Observable<boolean> | boolean {
   // Allow synchronous navigation (`true`) if no crisis or the crisis is unchanged
   if (!this.formValue || _.isEqual(this.formValue, this.form.value)) {
   return true;
   }
   // Otherwise ask the user with the dialog service and return its
   // promise which resolves to true or false when the user decides
   let p = this.dialogService.confirm();
   let o = Observable.fromPromise(p);
   return o;
   }*/
}
