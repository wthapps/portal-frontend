import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';

import { Constants } from '../../core/shared/config/constants';
import { fadeInAnimation } from '../../core/shared/animations/route.animation';
import { Errors } from '../../core/shared/models/errors.model';
import { UserService } from '../../core/shared/services/user.service';
import { ToastsService } from '../../core/shared/components/toast/toast-message.service';
import { LoadingService } from '../../core/shared/components/loading/loading.service';
import { CustomValidator } from '../../core/shared/validator/custom.validator';
/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css'],
  host: {
    "[@fadeInAnimation]": 'true'
  },
  animations: [fadeInAnimation]
})
export class HomeComponent {

  flagsRelease: boolean = Constants.flagsRelease;

  form: FormGroup;
  first_name: AbstractControl;
  last_name: AbstractControl;
  email: AbstractControl;
  password: AbstractControl;

  errors: any;
  submitted: boolean = false;

  constructor(private router: Router,
              private fb: FormBuilder,
              private userService: UserService,
              private toastsService: ToastsService,
              private loadingService: LoadingService) {
    if (this.flagsRelease) {
      this.router.navigate(['/login']);
    }

    this.form = fb.group({
      'first_name': ['',
        Validators.compose([Validators.required])
      ],
      'last_name': ['',
        Validators.compose([Validators.required])
      ],
      'email': ['',
        Validators.compose([Validators.required, CustomValidator.emailFormat])
      ],
      'password': ['', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        CustomValidator.lowercaseUppercase,
        CustomValidator.specialSymbolOrNumber
      ])]
    });

    this.first_name = this.form.controls['first_name'];
    this.last_name = this.form.controls['last_name'];
    this.email = this.form.controls['email'];
    this.password = this.form.controls['password'];
  }

  onSubmit(values: any): void {
    this.submitted = true;
    if (this.form.valid) {
      // start loading
      this.loadingService.start();

      let body = JSON.stringify({
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        password: values.password
      });

      this.userService.signup('users', body).subscribe(
        (res: any) => {
          this.loadingService.stop();
          this.router.navigateByUrl('/welcome');
        },
        error => {
          // stop loading
          this.loadingService.stop();

          console.log('error:', error);
          let err: any = error;

          this.errors = err;
          //TODO refactoring code check signup
          if (error.status === 422) {
            this.errors = 'Email has already been taken';
          }
          this.toastsService.danger(this.errors);
        });
    }
  }
}
