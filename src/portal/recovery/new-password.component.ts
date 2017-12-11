import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import {
  FormGroup,
  AbstractControl,
  FormBuilder,
  Validators
} from '@angular/forms';

import { ApiBaseService } from '../../shared/services/apibase.service';
import { CustomValidator } from '../../shared/shared/validator/custom.validator';
import { ToastsService } from '../../shared/shared/components/toast/toast-message.service';
import { LoadingService } from '../../shared/shared/components/loading/loading.service';
import { Constants } from '../../shared/constant/config/constants';

declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'sd-new-password',
  templateUrl: 'new-password.component.html'
})

export class NewPasswordComponent implements OnInit {
  form: FormGroup;
  password: AbstractControl;
  submitted: boolean = false;

  tooltip: any = Constants.tooltip;

  private selectedId: number;
  private selectedReset_code: string;

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private toastsService: ToastsService,
              private loadingService: LoadingService,
              private apiBaseService: ApiBaseService) {

    this.form = fb.group({
      'password': ['', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        CustomValidator.lowercaseUppercase,
        CustomValidator.specialSymbolOrNumber
      ])],
    });

    this.password = this.form.controls['password'];
  }

  /**
   * Get query parameters . Eg: ?u=4&c=91decb
   */
  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      this.selectedId = params['u'];
      this.selectedReset_code = params['c'];
    });
  }

  onSubmit(values: any): void {
    this.submitted = true;
    if (this.form.valid) {
      // start loading
      this.loadingService.start();

      let password = values.password;
      let body = JSON.stringify({
        id: this.selectedId,
        reset_code: this.selectedReset_code,
        password
      });
      this.apiBaseService.put('users/recovery/password', body)
        .subscribe((result: any) => {
            // stop loading
            this.loadingService.stop();
            if (result.data === null) {
              this.toastsService.danger(result.message);
            } else {
              this.toastsService.success('You set new password successfully!');
              this.router.navigate(['/login']);
            }
          },
          error => {
            // stop loading
            this.loadingService.stop();
            this.toastsService.danger(error);
            console.log('error:', error);
          });
    }
  }
}



