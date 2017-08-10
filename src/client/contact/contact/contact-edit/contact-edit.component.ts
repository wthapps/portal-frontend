import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';

import { CustomValidator } from '../../../core/shared/validator/custom.validator';

import { Contact } from '../contact.model';
import { Constants } from '../../../core/shared/config/constants';
import { LabelService } from '../../label/label.service';
import { Label } from '../../label/label.model';
import { TagInput } from '../../../core/shared/models/tag-input.model';
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

  public avatarDefault: string = Constants.img.avatar;

  deleteObjects: any = {};

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
  labels: AbstractControl;
  job_title: AbstractControl;
  notes: AbstractControl;

  filteredLabelsMultiple: any = [];
  originalLabels: Object[];

  constructor(private fb: FormBuilder, private labelService: LabelService) {
    this.labelService.getAllLabels().then((res: any)=> {
      this.originalLabels = res;
      _.map(res, (v: any)=> {
        this.filteredLabelsMultiple.push({value: v.name, display: v.name});
      });
    });
    this.deleteObjects['emails'] = [];
    this.deleteObjects['phones'] = [];
    this.deleteObjects['addresses'] = [];
    this.deleteObjects['media'] = [];

    this.createForm();
  }

  ngOnChanges() {

    if (this.contact && this.mode == 'edit') {
      this.removeAll();

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
        this.addItem('media', v);
      });

      this.avatarDefault = this.contact.profile_image;
      (<FormControl>this.name).setValue(this.contact.name);
      (<FormControl>this.company).setValue(this.contact.company);
      (<FormControl>this.job_title).setValue(this.contact.job_title);
      (<FormControl>this.notes).setValue(this.contact.notes);
      (<FormControl>this.labels).setValue(_.map(this.contact.labels, 'name'));
    }
  }

  createForm() {
    this.form = this.fb.group({
      'phones': this.fb.array([this.initItem('phones')]),
      'emails': this.fb.array([this.initItem('emails')]),
      'addresses': this.fb.array([this.initItem('addresses')]),
      'media': this.fb.array([this.initItem('media')]),
      'name': ['', Validators.compose([Validators.required])],
      'company': [''],
      'labels': [''],
      'job_title': [''],
      'notes': ['']
    });

    this.name = this.form.controls['name'];
    this.company = this.form.controls['company'];
    this.labels = this.form.controls['labels'];
    this.job_title = this.form.controls['job_title'];
    this.notes = this.form.controls['notes'];
  }

  removeAll() {
    const phones = <FormArray>this.form.controls['phones'];
    const emails = <FormArray>this.form.controls['emails'];
    const addresses = <FormArray>this.form.controls['addresses'];
    const media = <FormArray>this.form.controls['media'];

    phones.controls.length = 0;
    emails.controls.length = 0;
    addresses.controls.length = 0;
    media.controls.length = 0;

    phones.reset();
    emails.reset();
    addresses.reset();
    media.reset();
  }

  initItem(type: string, item?: any) {
    let formGroup: any = null;
    switch (type) {
      case 'phones': {
        let data: any = {category: '', value: ''};
        if (item) {
          formGroup = {
            id: [item.id, Validators.compose([Validators.required])],
            category: [item.category, Validators.compose([Validators.required])],
            value: [item.value, Validators.compose([CustomValidator.phoneFormat])]
          };
        } else {
          formGroup = {
            category: [data.category, Validators.compose([Validators.required])],
            value: [data.value, Validators.compose([CustomValidator.phoneFormat])]
          };
        }
        break;
      }
      case 'emails': {
        let data: any = {category: '', value: ''};
        if (item) {
          formGroup = {
            id: [item.id, Validators.compose([Validators.required])],
            category: [item.category, Validators.compose([Validators.required])],
            value: [item.value, Validators.compose([CustomValidator.emailFormat])]
          };
        } else {
          formGroup = {
            category: [data.category, Validators.compose([Validators.required])],
            value: [data.value, Validators.compose([CustomValidator.emailFormat])]
          };
        }
        break;
      }
      case 'addresses': {
        let data: any = {
          category: '',
          address_line1: '',
          po_box: '',
          city: '',
          province: '',
          postcode: '',
          country: ''
        };
        if (item) {
          formGroup = {
            id: [item.id, Validators.compose([Validators.required])],
            category: [item.category],
            address_line1: [item.address_line1],
            po_box: [item.po_box],
            city: [item.city],
            province: [item.province],
            postcode: [item.postcode],
            country: [item.country],
          };
        } else {
          formGroup = {
            category: [data.category],
            address_line1: [data.address_line1],
            po_box: [data.po_box],
            city: [data.city],
            province: [data.province],
            postcode: [data.postcode],
            country: [data.country],
          };
        }
        break;
      }
      case 'media': {
        let data: any = {category: '', value: ''};
        if (item) {
          formGroup = {
            id: [item.id, Validators.compose([Validators.required])],
            category: [item.category],
            value: [item.value, Validators.compose([CustomValidator.urlFormat])]
          };
        } else {
          formGroup = {
            category: [data.category],
            value: [data.value, Validators.compose([CustomValidator.urlFormat])],
          };
        }
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
    if (this.contact[type][i]) {
      this.contact[type][i]._destroy = true;
      this.deleteObjects[type].push(this.contact[type][i]);
    }
    control.removeAt(i);
  }

  onSubmit(values: any): void {
    this.contact.name = values.name;
    this.contact.company = values.company;
    this.contact.job_title = values.job_title;
    this.contact.emails = _.concat(values.emails, this.deleteObjects['emails']);
    this.contact.phones = _.concat(values.phones, this.deleteObjects['phones']);
    this.contact.media = _.concat(values.media, this.deleteObjects['media']);
    this.contact.addresses = _.concat(values.addresses, this.deleteObjects['addresses']);

    if (values.labels && values.labels.length > 0) {
      let labels: any = [];
      _.forEach(values.labels, (label: any) => {
        if (_.isObject(label)) {
          labels.push(_.filter(this.originalLabels, ['name', label.value])[0]);
        } else {
          labels.push(_.filter(this.originalLabels, ['name', label])[0]);
        }
      });
      this.contact.labels = labels;
    }

    this.contact.notes = values.notes;

    if (this.mode == 'create') {
      this.event.emit({action: 'contact:contact:create', payload: {item: this.contact}});
    }
    if (this.mode == 'edit') {
      this.event.emit({action: 'contact:contact:update', payload: {item: this.contact}});
    }
  }
}
