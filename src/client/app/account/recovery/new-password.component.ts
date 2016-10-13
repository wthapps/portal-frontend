import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import {
  ApiBaseService,
  ToastsService,
  //2 LoadingService,
  CustomValidator
}                           from '../../shared/index';

import {
  FormGroup,
  AbstractControl,
  FormBuilder,
  Validators
}                           from '@angular/forms';


@Component({
  moduleId: module.id,
  templateUrl: 'new-password.component.html'
})

export class NewPasswordComponent implements OnInit {
  form: FormGroup;
  password: AbstractControl;
  submitted: boolean = false;

  private selectedId: number;
  private selectedReset_code: string;

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private toastsService: ToastsService,
              //2 private loadingService: LoadingService,
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
   * Get query parameters . Eg: password?u=4&c=91decb
   */
  ngOnInit(): void {
    this.route.params.forEach((params: Params) => {
      this.selectedId = params['u'];
      this.selectedReset_code = params['c'];
    });
  }

  onSubmit(values: any): void {
    this.submitted = true;
    if (this.form.valid) {
      // start loading
      //2 this.loadingService.start();

      let password = values.password;
      let body = JSON.stringify({
        id: this.selectedId,
        reset_code: this.selectedReset_code,
        password
      });
      this.apiBaseService.put('users/recovery/password', body)
        .subscribe((result: any) => {
            // stop loading
            //2 this.loadingService.stop();
            if (result.data === null) {
              this.toastsService.danger(result.message);
            } else {
              this.router.navigate(['/login']);
            }
          },
          error => {
            // stop loading
            //2 this.loadingService.stop();
            this.toastsService.danger(error);
            console.log('error:', error);
          });
    }
  }
}



