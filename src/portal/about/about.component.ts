import { Component, OnInit, ViewChild, HostBinding } from '@angular/core';

import {
  FormGroup,
  AbstractControl,
  FormBuilder,
  Validators
} from '@angular/forms';

import { ReCaptchaComponent } from 'angular2-recaptcha/lib/captcha.component';

import { AboutService } from './about.service';

import { LoadingService } from '../../shared/shared/components/loading/loading.service';
import { ToastsService } from '../../shared/shared/components/toast/toast-message.service';
import { CustomValidator } from '../../shared/shared/validator/custom.validator';
import { fadeInAnimation } from '../../shared/shared/animations/route.animation';

/**
 * This class represents the lazy loaded AboutComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-about',
  templateUrl: 'about.component.html',
  styleUrls: ['about.component.scss'],
  animations: [fadeInAnimation]
})
export class AboutComponent implements OnInit {
  @HostBinding('@fadeInAnimation') fadeInAnimation = true;

  siteKey: string = '6LeZ0xIUAAAAABLfFeQpUGfK84j5aWgOnWbfJKM4';
  recaptchaState: boolean = false;

  @ViewChild(ReCaptchaComponent) captcha: ReCaptchaComponent;

  form: FormGroup;

  emailInput: string = '';
  first_nameInput: string = '';
  last_nameInput: string = '';
  first_name: AbstractControl;
  last_name: AbstractControl;
  email: AbstractControl;
  subject: AbstractControl;
  body: AbstractControl;
  submitted: boolean = false;

  _recaptchaResponse: any = '';

  constructor(private fb: FormBuilder,
              private aboutService: AboutService,
              private loadingService: LoadingService,
              private toastsService: ToastsService) {

    // if (this.userService.loggedIn) {
    //   this.emailInput = this.userService.profile.email;
    //   this.first_nameInput = this.userService.profile.first_name;
    //   this.last_nameInput = this.userService.profile.last_name;
    // }

    this.form = fb.group({
      'first_name': [this.first_nameInput],
      'last_name': [this.last_nameInput],
      'email': [this.emailInput,
        Validators.compose([Validators.required, CustomValidator.emailFormat])
      ],
      'subject': ['',
        Validators.compose([Validators.required, Validators.minLength(3)])
      ],
      'body': ['',
        Validators.compose([Validators.required, Validators.minLength(5)])
      ]
    });

    this.first_name = this.form.controls['first_name'];
    this.last_name = this.form.controls['last_name'];
    this.email = this.form.controls['email'];
    this.subject = this.form.controls['subject'];
    this.body = this.form.controls['body'];
  }

  ngOnInit(): any {
    this._recaptchaResponse = '';
    this.recaptchaState = false;
  }

  handleCorrectCaptcha(e: any) {
    console.log(e);
    this._recaptchaResponse = e;
    this.recaptchaState = true;
  }

  onSubmit(values: any): void {
    this.submitted = true;
    if (this.form.valid) {

      // start loading
      this.loadingService.start();

      values.body = values.body.replace(/(\r\n|\n\r|\r|\n)/g, '<br>');
      values.recaptcha_response = this._recaptchaResponse;

      let body = JSON.stringify(values);
      this.aboutService.createFeedback(body)
        .subscribe((result: any) => {
            this.loadingService.stop();
            this.toastsService.success('Message sent! Thanks for your email, we will answer you within 24 hours.');
          },
          (error: any) => {
            // stop loading
            this.loadingService.stop();
            this.toastsService.danger(error);
            //console.log('login error:', error);
          }
        );
    }

    this.captcha.reset();
  }
}
