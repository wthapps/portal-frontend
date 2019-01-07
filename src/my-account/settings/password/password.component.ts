import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms/';
import { Constants } from '@shared/constant';
import { UserService } from '@shared/services';
import { LoadingService } from '@shared/shared/components/loading/loading.service';
import { CustomValidator } from '@shared/shared/validator/custom.validator';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html'
})
export class SettingsPasswordComponent implements OnInit {
  form: any;
  oldPassword: AbstractControl;
  password: AbstractControl;
  tooltip: any = Constants.tooltip;
  baseUrls: any = Constants.baseUrls;


  constructor(private fb: FormBuilder, private loadingService: LoadingService, private userService: UserService, private messageService: MessageService) {
    this.form = fb.group({
      'oldPassword': ['', Validators.compose([Validators.required])],
      'password': ['', Validators.compose([
        Validators.required,
        Validators.minLength(Constants.user.minPassword),
        CustomValidator.lowercaseUppercase,
        CustomValidator.specialSymbolOrNumber])]
    });
    this.oldPassword = this.form.controls['oldPassword'];
    this.password = this.form.controls['password'];
  }

  ngOnInit() {
    // console.log(this.password)
  }

  onSubmit(values: any): void {
    // Set value after updating form (checking user leave this page)
    if (this.form.valid) {
      this.userService.changePassword({
        old_password: values.oldPassword,
        password: values.password
      }).subscribe((result: any) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Change password',
            detail: 'Your password was changed'
          });
        },
        error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Change password failed',
            detail: error.error.error
          });
        }
      );
    }
  }

  hideShowPassword(event: any): void {
    const target = event.target || event.srcElement || event.currentTarget;
    const inputPass = $(target).prev();
    if (inputPass.attr('type') === 'password') {
      inputPass.attr('type', 'text');
      $(target).addClass('active');
    } else {
      inputPass.attr('type', 'password');
      $(target).removeClass('active');
    }
  }
}
