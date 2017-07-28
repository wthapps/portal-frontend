import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { CustomValidator } from '../../../core/shared/validator/custom.validator';

import { Contact } from '../contact.model';
import { Constants } from '../../../core/shared/config/constants';
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'contact-edit',
  templateUrl: 'contact-edit.component.html',
  styleUrls: ['contact-edit.component.css']
})
export class ZContactEditComponent implements OnChanges {

  @Input('contact') contact: Contact;
  @Input() mode: string = 'create';
  @Output() event: EventEmitter<any> = new EventEmitter<any>();

  avatarDefault: string = Constants.img.avatar;

  phoneCategories: Array<any> = [
    {value: 'mobile', text: 'Mobile'},
    {value: 'home', text: 'Home'},
    {value: 'work', text: 'Work'},
    {value: 'main', text: 'Main'},
    {value: 'fax', text: 'Fax'},
    {value: 'other', text: 'Other'}
  ];

  emailCategories: Array<any> = [
    {value: 'work', text: 'Work'},
    {value: 'home', text: 'Home'},
    {value: 'other', text: 'Other'}
  ];

  mediaCategories: Array<any> = [
    {value: 'wthapps', text: 'WTHApps'},
    {value: 'facebook', text: 'Facebook'},
    {value: 'googleplus', text: 'Google Plus'},
    {value: 'twitter', text: 'Twitter'},
    {value: 'other', text: 'Other'}

  ];

  form: FormGroup;
  name: AbstractControl;
  company: AbstractControl;
  job_title: AbstractControl;
  notes: AbstractControl;

  constructor(private fb: FormBuilder) {
    this.createForm();
    console.log(this.form);
  }

  ngOnChanges() {
    this.removeAll();

    if (this.contact && this.mode == 'edit') {
      _.map(this.contact.phones, (v: any)=> {
        this.addItem('phones', v);
      });

      _.map(this.contact.emails, (v: any)=> {
        this.addItem('emails', v);
      });

      _.map(this.contact.addresses, (v: any)=> {
        this.addItem('addresses', v);
      });

      _.map(this.contact.media, (v: any)=> {
        this.addItem('medias', v);
      });

      this.avatarDefault = this.contact.profile_image;
      (<FormControl>this.name).setValue(this.contact.name);
      (<FormControl>this.company).setValue(this.contact.company);
      (<FormControl>this.job_title).setValue(this.contact.job_title);
      (<FormControl>this.notes).setValue(this.contact.notes);
    }
  }

  createForm() {
    this.form = this.fb.group({
      'phones': this.fb.array([this.initItem('phones')]),
      'emails': this.fb.array([this.initItem('emails')]),
      'addresses': this.fb.array([this.initItem('addresses')]),
      'medias': this.fb.array([this.initItem('medias')]),
      'name': [''],
      'company': [''],
      'job_title': [''],
      'notes': ['']
    });

    this.name = this.form.controls['name'];
    this.company = this.form.controls['company'];
    this.job_title = this.form.controls['job_title'];
    this.notes = this.form.controls['notes'];
  }

  removeAll() {
    const phones = <FormArray>this.form.controls['phones'];
    const emails = <FormArray>this.form.controls['emails'];
    const addresses = <FormArray>this.form.controls['addresses'];
    const medias = <FormArray>this.form.controls['medias'];

    phones.controls.length = 0;
    emails.controls.length = 0;
    addresses.controls.length = 0;
    medias.controls.length = 0;

    phones.reset();
    emails.reset();
    addresses.reset();
    medias.reset();
  }

  //phones
  initItem(type: string, item?: any) {
    let formGroup: any = null;
    switch (type) {
      case 'phones': {
        let data: any = {category: '', value: ''};
        if (item) {
          data = item;
        }

        formGroup = {
          category: [data.category, Validators.compose([Validators.required])],
          value: [data.value, Validators.compose([Validators.required, CustomValidator.phoneFormat])]
        };
        break;
      }
      case 'emails': {
        let data: any = {category: '', value: ''};
        if (item) {
          data = item;
        }

        formGroup = {
          category: [data.category, Validators.compose([Validators.required])],
          value: [data.value, Validators.compose([Validators.required, CustomValidator.emailFormat])]
        };
        break;
      }
      case 'addresses': {
        let data: any = {
          category: '',
          address_line1: '',
          address_line2: '',
          city: '',
          province: '',
          postcode: '',
          country: ''
        };
        if (item) {
          data = item;
        }

        formGroup = {
          category: [data.category],
          address_line1: [data.address_line1],
          address_line2: [data.address_line2],
          city: [data.city],
          province: [data.province],
          postcode: [data.postcode],
          country: [data.country],
        };
        break;
      }
      case 'medias': {
        let data: any = {category: '', value: ''};
        if (item) {
          data = item;
        }

        formGroup = {
          category: [data.category],
          value: [data.value]
        };
        break;
      }
      default: {
        break;
      }
    }
    return this.fb.group(formGroup);
  }

  addItem(type: string, item?: any) {
    let control = <FormArray>this.form.controls[type];
    if (item) {
      control.push(this.initItem(type, item));
    } else {
      control.push(this.initItem(type));
    }
  }

  removeItem(type: string, i: number) {
    const control = <FormArray>this.form.controls[type];
    control.removeAt(i);
  }

  onSubmit(values: any): void {
    values.id = this.contact.id;
    values.uuid = this.contact.uuid;

    if (this.mode == 'create') {
      this.event.emit({action: 'contact:contact:create', payload: {item: values}});
    }
    if (this.mode == 'edit') {
      this.event.emit({action: 'contact:contact:update', payload: {item: values}});
    }
  }
}
