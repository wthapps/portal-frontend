import {Component, OnInit}         from '@angular/core';
import {
  REACTIVE_FORM_DIRECTIVES,
  FormGroup,
  AbstractControl,
  FormBuilder,
  Validators
}                                  from '@angular/forms';

import {ROUTER_DIRECTIVES}         from '@angular/router';

import {Contact}                   from './contact';
import {ContactService}            from './contact.service';
import {
  LoadingService,
  ToastsService,
  UserService,
  ReCaptchaComponent,
  CustomValidator
}                                  from '../shared/index';

@Component({
  moduleId: module.id,
  templateUrl: 'contact.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    REACTIVE_FORM_DIRECTIVES,
    ReCaptchaComponent
  ],
  providers: [
    ContactService
  ],
  styleUrls: ['contact.component.css']
})

export class ContactComponent implements OnInit {
  siteKey:string = '6LcuZiMTAAAAACtTNvG7j8FS5nS81R-HGN5OIo8B';
  recaptchaState:boolean = false;

  form:FormGroup;

  emailInput:string = '';
  first_nameInput:string = '';
  last_nameInput:string = '';
  first_name:AbstractControl;
  last_name:AbstractControl;
  email:AbstractControl;
  subject:AbstractControl;
  body:AbstractControl;
  submitted:boolean = false;

  _recaptchaResponse:any = '';

  constructor(private fb:FormBuilder,
              private _userService:UserService,
              private _contactService:ContactService,
              private _toastsService:ToastsService,
              private _loadingService:LoadingService) {

    if (this._userService.loggedIn) {
      this.emailInput = this._userService.profile.email;
      this.first_nameInput = this._userService.profile.first_name;
      this.last_nameInput = this._userService.profile.last_name;
    }

    this.form = fb.group({
      'first_name': [this.first_nameInput],
      'last_name': [this.last_nameInput],
      'email': [this.emailInput,
        Validators.compose([Validators.required, CustomValidator.emailFormat])
      ],
      'subject': ['',
        Validators.compose([Validators.required, Validators.minLength(10)])
      ],
      'body': ['',
        Validators.compose([Validators.required, Validators.minLength(20)])
      ]
    });

    this.first_name = this.form.controls['first_name'];
    this.last_name = this.form.controls['last_name'];
    this.email = this.form.controls['email'];
    this.subject = this.form.controls['subject'];
    this.body = this.form.controls['body'];
  }

  ngOnInit():any {
    this._recaptchaResponse = '';
    this.recaptchaState = false;
  }

  handleCorrectCaptcha(event:any) {
    this._recaptchaResponse = event;
    this.recaptchaState = true;
  }

  onSubmit(values:Contact):void {
    this.submitted = true;
    if (this.form.valid) {

      // start loading
      this._loadingService.start();

      values.body = values.body.replace(/(\r\n|\n\r|\r|\n)/g, '<br>');
      values.recaptcha_response = this._recaptchaResponse;

      let body = JSON.stringify(values);
      this._contactService.createFeedback(body)
        .subscribe((result:any) => {
            if (result) {
              this._loadingService.stop();
              this._toastsService.success('Message sent! Thanks for your email, we will answer you within 24 hours.');
            }
          },
          (error:any) => {
            // stop loading
            this._loadingService.stop();
            this._toastsService.danger('Invalid email or password');
            //console.log('login error:', error);
          }
        );
    }
  }
}
