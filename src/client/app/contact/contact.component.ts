import {Component}          from '@angular/core';
import {CustomValidators}   from '../shared/validator/custom-validators';
import {
  FORM_DIRECTIVES,
  FormBuilder,
  ControlGroup,
  Validators
}                           from '@angular/common';
import {ROUTER_DIRECTIVES}  from '@angular/router';

@Component({
  moduleId: module.id,
  templateUrl: 'contact.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    FORM_DIRECTIVES
  ],
  styleUrls: ['contact.component.css']
})

export class ContactComponent {
  pageTitle:string = 'Contact page';

  contact:any;
  contactForm:ControlGroup;
  departments:any[] = [
    {
      id: 0,
      value: 'Please select a department...'
    },
    {
      id: 1,
      value: 'Tech Department'
    },
    {
      id: 2,
      value: 'Billing Department'
    }
  ];

  constructor(private _builder:FormBuilder) {
    this.contactForm = this._builder.group({
      name: ['', Validators.required],
      email: ['',
        Validators.compose([Validators.required, CustomValidators.emailFormat])
      ],
      department: [0,
        Validators.compose([Validators.required, CustomValidators.selectOption])
      ],
      message: ['', Validators.required]
    });
  }

  submit() {
    this.contact = this.contactForm.value;
    //console.log('data sent to server', this.user);

    let body = JSON.stringify({
      name: this.contact.name,
      email: this.contact.email,
      department: this.contact.department,
      message: this.contact.message
    });
    console.log('Send:', body);
  }

}
