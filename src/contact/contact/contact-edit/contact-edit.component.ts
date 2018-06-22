import { Component, EventEmitter, Input, OnChanges, Output, OnInit, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';

import { Contact } from '../contact.model';
import { GroupService } from '../../group/group.service';
import { CountryService } from '@shared/shared/components/countries/countries.service';
import { Constants } from '@shared/constant';
import { CustomValidator } from '@shared/shared/validator/custom.validator';
import { ZContactService } from '@contacts/shared/services/contact.service';
import { distinctUntilChanged, debounceTime, switchMap } from 'rxjs/operators';

declare let _: any;

@Component({
  selector: 'contact-edit',
  templateUrl: 'contact-edit.component.html',
  styleUrls: ['contact-edit.component.scss']
})
export class ZContactEditComponent implements OnChanges, OnInit, OnDestroy {

  @Input('contact') contact: Contact;
  @Input() mode = 'create';
  @Output() event: EventEmitter<any> = new EventEmitter<any>();
  @Output() eventForm: EventEmitter<any> = new EventEmitter<any>();

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

  countriesCode: any;
  countriesNameCode: any;

  filteredCountriesCode: Array<any> = new Array<any>();

  form: FormGroup;
  name: AbstractControl;
  company: AbstractControl;
  groups: AbstractControl;
  job_title: AbstractControl;
  notes: AbstractControl;

  filteredGroupsMultiple: any = [];
  originalGroups: Object[];
  disableEdit = true;
  sub: any;

  constructor(private fb: FormBuilder,
              private groupService: GroupService,
              private contactService: ZContactService,
              private countryService: CountryService) {
    this.groupService.getAllGroups().then((res: any) => {
      this.originalGroups = res;
      _.map(res, (v: any) => {
        this.filteredGroupsMultiple.push({value: v.name, display: v.name});
      });
    });
    this.deleteObjects['emails'] = [];
    this.deleteObjects['phones'] = [];
    this.deleteObjects['addresses'] = [];
    this.deleteObjects['media'] = [];

    this.createForm();


    this.sub = this.form.valueChanges
      .subscribe((e) => {
        this.eventForm.emit(this.form);

        this.form.get('emails')['controls'].forEach((control, index) => {
          if (control.valid && control.value.value !== '' && !control.pristine) {
            let sub = control.valueChanges.pipe(debounceTime(250)).subscribe(ctrl => {
              const emails = this.form.get('emails')['controls'];
              this.event.emit({action: 'contact:contact:edit_email', payload: {item: emails[index].value, emails: emails}});
              sub.unsubscribe();
              // this.sub.unsubscribe();
            });
          }
        });
      });
  }

  ngOnInit(): void {
    this.countryService.getCountries().subscribe(
      (res: any) => {
        this.countriesCode = res;
        this.countriesNameCode = _.map(res,
          (v: any) => {
            return v.name + ' (' + v.dial_code + ')';
          }
        );
      });
  }

  ngOnChanges() {

    if (this.contact && this.mode !== 'create') {
      this.removeAll();

      _.map(this.contact.phones, (v: any) => {
        this.addItem('phones', v);
      });

      _.map(this.contact.emails, (v: any) => {
        this.addItem('emails', v);
      });

      _.map(this.contact.addresses, (v: any) => {
        this.addItem('addresses', v);
      });

      _.map(this.contact.media, (v: any) => {
        this.addItem('media', v);
      });

      this.avatarDefault = this.contact.profile_image;
      (<FormControl>this.name).setValue(this.contact.name);
      (<FormControl>this.company).setValue(this.contact.company);
      (<FormControl>this.job_title).setValue(this.contact.job_title);
      (<FormControl>this.notes).setValue(this.contact.notes);
      (<FormControl>this.groups).setValue(_.map(this.contact.groups, 'name'));
    }
  }

  ngOnDestroy() {
  }

  createForm() {
    this.form = this.fb.group({
      'phones': this.fb.array([this.initItem('phones')]),
      'emails': this.fb.array([this.initItem('emails')]),
      'addresses': this.fb.array([this.initItem('addresses')]),
      'media': this.fb.array([this.initItem('media')]),
      'name': ['', Validators.compose([Validators.required])],
      'company': [''],
      'groups': [''],
      'job_title': [''],
      'notes': ['']
    });

    this.name = this.form.controls['name'];
    this.company = this.form.controls['company'];
    this.groups = this.form.controls['groups'];
    this.job_title = this.form.controls['job_title'];
    this.notes = this.form.controls['notes'];
    setTimeout(() => {
      this.form.valueChanges.subscribe((data: any) => this.disableEdit = false);
    }, 400);
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
        let data: any = {category: 'mobile', value: ''};
        if (item) {
          formGroup = {
            id: [item.id, Validators.compose([Validators.required])],
            category: [item.category, Validators.compose([Validators.required])],
            country_alpha_code: [item.country_alpha_code || this.contactService.defaultCountryCode],
            value: [item.value, Validators.compose([CustomValidator.phoneFormat])]
          };
        } else {
          formGroup = {
            category: [data.category, Validators.compose([Validators.required])],
            country_alpha_code: [this.contactService.defaultCountryCode],
            value: [data.value, Validators.compose([CustomValidator.phoneFormat])]
          };
        }
        break;
      }
      case 'emails': {
        let data: any = {category: 'work', value: ''};
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
          category: 'work',
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
        let data: any = {category: 'wthapps', value: ''};
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

    if (type === 'emails') {
      this.event.emit({action: 'contact:contact:remove_email', payload: this.form.controls[type]['controls'][i].value});
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

    if (values.groups && values.groups.length > 0) {
      let groups: any = [];
      _.forEach(values.groups, (group: any) => {
        if (_.isObject(group)) {
          groups.push(_.filter(this.originalGroups, ['name', group.value])[0]);
        } else {
          groups.push(_.filter(this.originalGroups, ['name', group])[0]);
        }
      });
      this.contact.groups = groups;
    }

    this.contact.notes = values.notes;

    if (this.mode === 'create') {
      this.event.emit({action: 'contact:contact:create', payload: {item: this.contact}});
    }
    if (this.mode === 'edit') {
      this.event.emit({action: 'contact:contact:update', payload: {item: this.contact}});
    }
  }

  filterCountriesCode(event: any) {
    this.filteredCountriesCode = [];
    for (let i = 0; i < this.countriesNameCode.length; i++) {
      let brand = this.countriesNameCode[i];
      if (brand.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
        this.filteredCountriesCode.push(brand);
      }
    }
  }
}
