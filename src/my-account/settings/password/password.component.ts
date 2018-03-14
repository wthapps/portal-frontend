import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, AbstractControl } from "@angular/forms/";
import { Constants } from "@shared/constant";
import { CustomValidator } from "@shared/shared/validator/custom.validator";
import { LoadingService } from "@shared/shared/components/loading/loading.service";
import { UserService } from "@shared/services";
import { ToastsService } from "@shared/shared/components/toast/toast-message.service";

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})
export class SettingsPasswordComponent implements OnInit {
  form: any;
  oldPassword: AbstractControl;
  password: AbstractControl;
  tooltip: any = Constants.tooltip;
  baseUrls: any = Constants.baseUrls;


  constructor(private fb: FormBuilder, private loadingService: LoadingService, private userService: UserService, private toastsService: ToastsService) {
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
      let old_password = values.oldPassword;
      let password = values.password;
      // start loading
      this.loadingService.start();

      let body = JSON.stringify({
        old_password: old_password,
        password: password
      });
      this.userService.changePassword(`users/${this.userService.getSyncProfile().id}`, body)
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
          }
        );
    }
  }

}
