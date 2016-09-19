import {
  Component,
  OnInit,
  OnDestroy
}                           from '@angular/core';
import {
  ROUTER_DIRECTIVES,
  Router
}                           from '@angular/router';

import {
  ApiBaseService,
  ToastsService,
  LoadingService,
  CustomValidator
}                           from '../../shared/index';

import {
  REACTIVE_FORM_DIRECTIVES,
  FormGroup,
  AbstractControl,
  FormBuilder,
  Validators
}                           from '@angular/forms';


@Component({
  moduleId: module.id,
  templateUrl: 'new-password.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    REACTIVE_FORM_DIRECTIVES
  ]
})

export class NewPasswordComponent implements OnInit, OnDestroy {
  form:FormGroup;
  password:AbstractControl;
  submitted:boolean = false;

  private sub:any;
  private selectedId:number;
  private selectedReset_code:string;

  constructor(private fb:FormBuilder,
              private router:Router,
              private _apiBaseService:ApiBaseService,
              private _toastsService:ToastsService,
              private _loadingService:LoadingService) {

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
  ngOnInit():void {
    this.sub = this.router
      .routerState
      .queryParams
      .subscribe(params => {
        this.selectedId = params['u'];
        this.selectedReset_code = params['c'];
      });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onSubmit(values:any):void {
    this.submitted = true;
    if (this.form.valid) {
      // start loading
      this._loadingService.start();

      let password = values.password;
      let body = JSON.stringify({
        id: this.selectedId,
        reset_code: this.selectedReset_code,
        password
      });
      this._apiBaseService.put('users/recovery/password', body)
        .subscribe((result:any) => {
            // stop loading
            this._loadingService.stop();
            if (result.data === null) {
              this._toastsService.danger(result.message);
            } else {
              this.router.navigate(['/login']);
            }
          },
          error => {
            // stop loading
            this._loadingService.stop();
            this._toastsService.danger(error);
            console.log('error:', error);
          });
    }
  }
}



