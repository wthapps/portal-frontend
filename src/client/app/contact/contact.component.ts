import {Component, OnInit}         from '@angular/core';
import {
  FORM_DIRECTIVES,
  FormBuilder,
  ControlGroup,
  Validators
}                                  from '@angular/common';
import {ROUTER_DIRECTIVES}         from '@angular/router';

import {CustomValidators}          from '../shared/validator/custom-validators';
import {UserService}               from '../shared/services/user.service';
import {Contact}                   from './contact';
import {ContactService}            from './contact.service';
import {LoadingService}            from '../partials/loading/index';
import {TopMessageService}         from '../partials/topmessage/index';

@Component({
  moduleId: module.id,
  templateUrl: 'contact.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    FORM_DIRECTIVES
  ],
  providers: [
    LoadingService
  ],
  styleUrls: ['contact.component.css']
})

export class ContactComponent implements OnInit {
  protected pageTitle:string = 'Contact page';

  public Contact: Contact = new Contact();
  public contactForm:ControlGroup;

  ngOnInit(): any {
    this.updateContactForm(this.Contact);
  }

  constructor(private _builder: FormBuilder, 
              private _userService: UserService,
              private _contactService: ContactService,
              private _loadingService: LoadingService,
              private _topMessageService: TopMessageService) {
    
  }

  submit() {
    this._loadingService.start();
    this.Contact = this.contactForm.value;
    let body = JSON.stringify(this.Contact);
    this._contactService.createFeedback(body).subscribe(
      result => {
        this._loadingService.stop();
        this._topMessageService.success("Message sent! Thanks for your email, we'll answer you within 24 hours.");
      },
      error => {
        this._loadingService.stop();
        this._topMessageService.danger('Your message could not be sent');
      }
    );
    this.updateContactForm(this.Contact);
  }

  private updateContactForm(contact: Contact) {

    this.createContactForm();

    contact.email = '';
    contact.subject = '';
    contact.body = '';
    if (this._userService.profile != null) {
      contact.email = this._userService.profile.email;
    }
    this.contactForm.controls['email'].updateValue(contact.email);
    this.contactForm.controls['subject'].updateValue(contact.subject);
    this.contactForm.controls['body'].updateValue(contact.body);
  }

  private createContactForm() {
    this.contactForm = this._builder.group({
      email: ['',
        Validators.compose([Validators.required, CustomValidators.emailFormat])
      ],
      subject: ['',
        Validators.compose([Validators.required, CustomValidators.inputSize])
      ],
      body: ['',
        Validators.compose([Validators.required, CustomValidators.inputSize])
      ]
    });
  }
}
