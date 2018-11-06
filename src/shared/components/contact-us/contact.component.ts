import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';

import {
  FormGroup,
  AbstractControl,
  FormBuilder,
  Validators,
  FormControl
} from '@angular/forms';

import { takeUntil } from 'rxjs/operators';

import { ReCaptchaComponent } from 'angular2-recaptcha/lib/captcha.component';

import { ContactService } from './contact.service';

import { UserService } from '@shared/services';
import { User } from '@shared/shared/models';
import { LoadingService } from '@shared/shared/components/loading/loading.service';
import { ToastsService } from '@shared/shared/components/toast/toast-message.service';
import { CustomValidator } from '@shared/shared/validator/custom.validator';
import { environment } from '@env/environment';

import { componentDestroyed } from 'ng2-rx-componentdestroyed';


/**
 * This class represents the lazy loaded AboutComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'app-contact',
  templateUrl: 'contact.component.html',
  styleUrls: ['contact.component.scss']
})
export class ContactComponent implements OnInit, OnDestroy {
  siteKey: string = environment.keys.recaptcha_site_key;
  recaptchaState: Boolean = false;

  @ViewChild(ReCaptchaComponent) captcha: ReCaptchaComponent;

  form: FormGroup;

  emailInput: String = '';
  first_nameInput: String = '';
  last_nameInput: String = '';
  first_name: AbstractControl;
  last_name: AbstractControl;
  email: AbstractControl;
  subject: AbstractControl;
  body: AbstractControl;
  submitted: Boolean = false;

  private recaptchaResponse: any = '';

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    private userService: UserService,
    private loadingService: LoadingService,
    private toastsService: ToastsService
  ) {
    // if (this.userService.loggedIn) {
    //   this.emailInput = this.userService.getSyncProfile().email;
    //   this.first_nameInput = this.userService.getSyncProfile().first_name;
    //   this.last_nameInput = this.userService.getSyncProfile().last_name;
    // }

    this.form = fb.group({
      first_name: [this.first_nameInput],
      last_name: [this.last_nameInput],
      email: [
        this.emailInput,
        Validators.compose([Validators.required, CustomValidator.emailFormat])
      ],
      subject: ['', Validators.compose([Validators.required])],
      body: ['', Validators.compose([Validators.required])]
    });

    this.first_name = this.form.controls['first_name'];
    this.last_name = this.form.controls['last_name'];
    this.email = this.form.controls['email'];
    this.subject = this.form.controls['subject'];
    this.body = this.form.controls['body'];
  }

  ngOnInit(): any {
    this.recaptchaResponse = '';
    this.recaptchaState = false;

    this.userService.profile$.subscribe((res: User) => {
      if (res) {
        (<FormControl>this.email).setValue(res.email);
      }
    });
  }

  ngOnDestroy() {}

  handleCorrectCaptcha(e: any) {
    this.recaptchaResponse = e;
    this.recaptchaState = true;
  }

  onSubmit(values: any): void {
    this.submitted = true;
    if (this.form.valid) {
      // start loading
      this.loadingService.start();

      values.body = values.body.replace(/(\r\n|\n\r|\r|\n)/g, '<br>');
      values.recaptcha_response = this.recaptchaResponse;

      const body = JSON.stringify(values);
      this.contactService.createFeedback(body)
        .pipe(takeUntil(componentDestroyed(this)))
        .subscribe(
          (res: any) => {
            this.loadingService.stop();
            this.toastsService.success(
              'Message sent! Thanks for your email, we will answer you within 24 hours.'
            );
          },
          (error: any) => {
            // stop loading
            this.loadingService.stop();
            this.toastsService.danger('Sending of the email failed');
            // console.log('login error:', error);
          }
        );
    }

    this.captcha.reset();
  }
}
