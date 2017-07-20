import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { Contact } from '../contact.model';
import { Address } from '../address.model';
import { SocialMedium } from '../social-medium.model';
import { Email } from '../email.model';
import { Phone } from '../phone.model';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidator } from '../../../core/shared/validator/custom.validator';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'contact-edit',
  templateUrl: 'contact-edit.component.html',
  styleUrls: ['contact-edit.component.css']
})
export class ContactEditComponent implements OnInit, OnChanges {

  @Input('contact') contact: Contact;
  @Input() mode: string = 'create';
  @Output() event: EventEmitter<any> = new EventEmitter<any>();

  phoneCategories: Array<any> = [
    { value: 'mobile', text: 'Mobile'},
    { value: 'home', text: 'Home'},
    { value: 'work', text: 'Work'},
    { value: 'main', text: 'Main'},
    { value: 'fax', text: 'Fax'},
    { value: 'other', text: 'Other'}
  ];

  categories: Array<any> = [
    { value: 'work', text: 'Work'},
    { value: 'home', text: 'Home'},
    { value: 'other', text: 'Other'}
  ];

  mediaCategories: Array<any> = [
    { value: 'wthapps', text: 'WTHApps'},
    { value: 'facebook', text: 'Facebook'},
    { value: 'googleplus', text: 'Google Plus'},
    { value: 'twitter', text: 'Twitter'},
    { value: 'other', text: 'Other'}

  ];

  form: FormGroup;

  constructor(private fb: FormBuilder) {

  }

  ngOnInit() {
    console.log('this.mode:::', this.mode);

    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if(this.form !== undefined) {
      this.initForm();
    }
  }

  doEvent(event?: any) {

    if (this.mode == 'create') {
      this.event.emit({action:'contact:contact:create', payload: {item: this.form.value}});
    } if (this.mode == 'edit') {
      this.event.emit({action:'contact:contact:update', payload: {item: this.form.value}});
    }
  }

  get phones(): Array<Phone> {
    return this.contact.phones;
  }

  get emails(): Array<Email> {
    return this.contact.emails;
  }

  get addresses(): Array<Address> {
    return this.contact.addresses;
  }

  get media(): Array<SocialMedium> {
    return this.contact.media;
  }

  initForm() {

    if(this.mode == 'create') {
      this.form = this.fb.group({
        name: [this.contact.name, Validators.required],
        company: [this.contact.company],
        job_title: [this.contact.job_title],
        notes: [this.contact.notes],
        description: [this.contact.description],
        phones: this.fb.array([
          this.fb.group({
            category: [this.contact.phones[0].category, Validators.compose([Validators.required])],
            country_alpha_code: [this.contact.phones[0].country_alpha_code],
            value: [this.contact.phones[0].value, Validators.compose([CustomValidator.phoneFormat])]
          })
        ]),
        emails: this.fb.array([
          this.fb.group({
            category: [this.contact.emails[0].category, Validators.required],
            value: [this.contact.emails[0].value, CustomValidator.emailFormat]
          })
        ]),
        addresses: this.fb.array([
          this.fb.group({
            category: [this.contact.addresses[0].category, Validators.compose([Validators.required])],
            address_line1: [this.contact.addresses[0].address_line1],
            address_line2: [this.contact.addresses[0].address_line2],
            city: [this.contact.addresses[0].city],
            postcode: [this.contact.addresses[0].postcode],
            province: [this.contact.addresses[0].province],
            country: [this.contact.addresses[0].country],
            primary: [this.contact.addresses[0].primary]
          })
        ]),
      });
    } else {
      this.form = this.fb.group({
        id: [this.contact.id],
        uuid: [this.contact.uuid],
        name: [this.contact.name, Validators.required],
        company: [this.contact.company],
        job_title: [this.contact.job_title],
        notes: [this.contact.notes],
        description: [this.contact.description],
        phones: this.fb.array([
          this.fb.group({
            id: [this.contact.phones[0].id || 0],
            category: [this.contact.phones[0].category, Validators.compose([Validators.required])],
            country_alpha_code: [this.contact.phones[0].country_alpha_code],
            value: [this.contact.phones[0].value, Validators.compose([CustomValidator.phoneFormat])]
          })
        ]),
        emails: this.fb.array([
          this.fb.group({
            id: [this.contact.emails[0].id] || 0,
            category: [this.contact.emails[0].category, Validators.required],
            value: [this.contact.emails[0].value, CustomValidator.emailFormat]
          })
        ]),
        addresses: this.fb.array([
          this.fb.group({
            id: [this.contact.addresses[0].id] || 0,
            category: [this.contact.addresses[0].category, Validators.compose([Validators.required])],
            address_line1: [this.contact.addresses[0].address_line1],
            address_line2: [this.contact.addresses[0].address_line2],
            city: [this.contact.addresses[0].city],
            postcode: [this.contact.addresses[0].postcode],
            province: [this.contact.addresses[0].province],
            country: [this.contact.addresses[0].country],
            primary: [this.contact.addresses[0].primary]
          })
        ]),
      });
    }

  }

  editing(): boolean {
    if (this.mode === 'view') {
      return false;
    }
    return true;
  }
}
