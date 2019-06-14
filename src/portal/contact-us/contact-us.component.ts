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

import { ContactUsService } from './contact-us.service';

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
  selector: 'contact-us',
  templateUrl: 'contact-us.component.html',
  styleUrls: ['contact-us.component.scss']
})
export class ContactUsComponent implements OnInit, OnDestroy {
  siteKey: string = environment.keys.recaptcha_site_key;
  recaptchaState: Boolean = false;

  @ViewChild(ReCaptchaComponent) captcha: ReCaptchaComponent;

  form: FormGroup;

  first_name: AbstractControl;
  last_name: AbstractControl;
  email: AbstractControl;
  subject: AbstractControl;
  content: AbstractControl;
  submitted: Boolean = false;

  private recaptchaResponse: any = '';

  constructor(
    private fb: FormBuilder,
    private contactUsService: ContactUsService,
    private userService: UserService,
    private loadingService: LoadingService,
    private toastsService: ToastsService
  ) {
    this.form = fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, CustomValidator.emailFormat])],
      subject: ['', Validators.compose([Validators.required])],
      content: ['', Validators.compose([Validators.required])]
    });

    this.first_name = this.form.controls['first_name'];
    this.last_name = this.form.controls['last_name'];
    this.email = this.form.controls['email'];
    this.subject = this.form.controls['subject'];
    this.content = this.form.controls['content'];
  }

  ngOnInit(): any {
    this.recaptchaResponse = '';
    this.recaptchaState = false;

    this.userService.profile$.subscribe((res: User) => {
      if (res) {
        (<FormControl>this.first_name).setValue(res.first_name);
        (<FormControl>this.last_name).setValue(res.last_name);
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

      values.content = values.content.replace(/(\r\n|\n\r|\r|\n)/g, '<br>');
      this.contactUsService.create(values)
        .pipe(takeUntil(componentDestroyed(this)))
        .subscribe(
          (res: any) => {
            this.loadingService.stop();
            this.toastsService.success('Message sent', 'Thanks for your email. We\'ve received your request and certainly help you out as soon as we can'
            );
          },
          (error: any) => {
            this.loadingService.stop();
            this.toastsService.danger('Message failed', `Sending of the email failed. ${error.error.error}`);
          }
        );
    }

    this.captcha.reset();
  }
}
