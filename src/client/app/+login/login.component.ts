import {Component}          from '@angular/core';
import {
  ROUTER_DIRECTIVES,
  Router,
  ActivatedRoute
}                           from '@angular/router';

import {
  UserService,
  ToastsService,
  LoadingService,
  RedirectService,
  CustomValidator
}                           from '../shared/index';

import {
  REACTIVE_FORM_DIRECTIVES,
  FormGroup,
  AbstractControl,
  FormBuilder,
  Validators
}                           from '@angular/forms';

declare var $:any;

@Component({
  moduleId: module.id,
  templateUrl: 'login.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    REACTIVE_FORM_DIRECTIVES
  ]
})

export class LoginComponent {
  form:FormGroup;
  email:AbstractControl;
  password:AbstractControl;
  submitted:boolean = false;

  constructor(private fb:FormBuilder,
              private router:Router,
              private userService:UserService,
              private params:ActivatedRoute,
              private toastsService:ToastsService,
              private loadingService:LoadingService,
              private redirectService:RedirectService) {

    // if (this.userService.loggedIn) {
    //   this.router.navigate(['/account/setting/profile']);
    // }

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

  onSubmit(values:any):void {
    this.submitted = true;
    if (this.form.valid) {
      // start loading
      this.loadingService.start();

      let email = values.email;
      let password = values.password;

      let body = JSON.stringify({user: {email, password}});
      this.userService.login('users/sign_in', body)
        .subscribe((result) => {
            if (result) {
              let prev = this.redirectService.prev(this.params);
              this.loadingService.stop();
              this.router.navigateByUrl(prev);
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
}



