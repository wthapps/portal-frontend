import {Component, OnInit}         from '@angular/core';
import {
  FORM_DIRECTIVES,
  FormBuilder,
  ControlGroup,
  Validators
}                                  from '@angular/common';
import {ROUTER_DIRECTIVES}         from '@angular/router';

import {CustomValidators}          from '../shared/validator/custom-validators';
import {Contact}                   from './contact';
import {ContactService}            from './contact.service';
import {
  LoadingService,
  ToastsService,
  UserService
}                                  from '../shared/index';
import {ReCaptchaComponent}        from '../shared/googlerecaptcha.directive';

@Component({
  moduleId: module.id,
  templateUrl: 'contact.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    FORM_DIRECTIVES,
    ReCaptchaComponent
  ],
  providers: [
    ContactService
  ],
  styleUrls: ['contact.component.css']
})

export class ContactComponent implements OnInit {
  protected pageTitle:string = 'Contact page';

  public contact: Contact;
  public contactForm: ControlGroup;
  public siteKey: string = '6LcuZiMTAAAAACtTNvG7j8FS5nS81R-HGN5OIo8B';
  public recaptchaState: boolean = false;

  private _recaptchaResponse: any = '';

  public handleCorrectCaptcha(event) {
    this._recaptchaResponse = event;
    this.recaptchaState = true;
  }

  ngOnInit(): any {
    this._recaptchaResponse = '';
    this.recaptchaState = false;
    this.createContactForm();
    this.updateContactForm();
  }

  constructor(private _builder: FormBuilder,
              private _userService: UserService,
              private _contactService: ContactService,
              private _loadingService: LoadingService,
              private _toastsService: ToastsService) {

  }

  submit() {
    this._loadingService.start();
    this.contact = this.contactForm.value;
    this.contact.recaptcha_response = this._recaptchaResponse;
    this.contact.body = this.contact.body.replace(/(\r\n|\n\r|\r|\n)/g, '<br>');
    let body = JSON.stringify(this.contact);
    this._contactService.createFeedback(body).subscribe(
      result => {
        this._loadingService.stop();
        this._toastsService.success('Message sent! Thanks for your email, we will answer you within 24 hours.');
      },
      error => {
        this._loadingService.stop();
        this._toastsService.danger('Your message could not be sent');
      }
    );
    this.updateContactForm();
    grecaptcha.reset();
  }

  private updateContactForm() {
    this.contact = new Contact();
    this.recaptchaState = false;
    if (this._userService.profile !== null) {
      this.contact.email = this._userService.profile.email;
    }

    this.contactForm.controls['email'].updateValue(this.contact.email);
    this.contactForm.controls['subject'].updateValue(this.contact.subject);
    this.contactForm.controls['body'].updateValue(this.contact.body);
    this.contactForm.controls['email'].setErrors(null);
    this.contactForm.controls['subject'].setErrors(null);
    this.contactForm.controls['body'].setErrors(null);
  }

  private createContactForm() {
    this.contactForm = this._builder.group({
      email: ['',
        Validators.compose([Validators.required, CustomValidators.emailFormat])
      ],
      subject: ['',
        Validators.compose([Validators.required, Validators.minLength(20)])
      ],
      body: ['',
        Validators.compose([Validators.required, Validators.minLength(20)])
      ]
    });
  }
}
