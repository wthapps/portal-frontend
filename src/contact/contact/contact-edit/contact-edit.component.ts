import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Subject, Subscription } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

import { ZContactService } from '@contacts/shared/services/contact.service';
import { WMediaSelectionService } from '@shared/components/w-media-selection/w-media-selection.service';
import { Constants } from '@shared/constant';
import { CountryService } from '@shared/shared/components/countries/countries.service';
import { CustomValidator } from '@shared/shared/validator/custom.validator';
import { CommonEventService, PhotoUploadService } from '@wth/shared/services';
import { GroupService } from '../../group/group.service';
import { Contact } from '../contact.model';

declare let _: any;

@Component({
  selector: 'contact-edit',
  templateUrl: 'contact-edit.component.html',
  styleUrls: ['contact-edit.component.scss']
})
export class ZContactEditComponent implements OnChanges, OnInit, OnDestroy {

  // tslint:disable-next-line:no-input-rename
  @Input('contact') contact: Contact;
  @Input() mode = 'create';
  @Output() event: EventEmitter<any> = new EventEmitter<any>();
  @Output() eventForm: EventEmitter<any> = new EventEmitter<any>();

  public avatarDefault: string = Constants.img.avatar;

  deleteObjects: any = {};

  phoneCategories: Array<any> = [
    { value: 'mobile', text: 'Mobile' },
    { value: 'home', text: 'Home' },
    { value: 'work', text: 'Work' },
    { value: 'main', text: 'Main' },
    { value: 'fax', text: 'Fax' },
    { value: 'other', text: 'Other' }
  ];

  emailCategories: Array<any> = [
    { value: 'work', text: 'Work' },
    { value: 'home', text: 'Home' },
    { value: 'other', text: 'Other' }
  ];

  mediaCategories: Array<any> = [
    { value: 'wthapps', text: 'WTHApps' },
    { value: 'facebook', text: 'Facebook' },
    { value: 'googleplus', text: 'Google Plus' },
    { value: 'twitter', text: 'Twitter' },
    { value: 'other', text: 'Other' }

  ];

  countriesCode: any;
  countriesNameCode: any;

  form: FormGroup;
  name: AbstractControl;
  family_name: AbstractControl;
  company: AbstractControl;
  // groups: AbstractControl;
  job_title: AbstractControl;
  notes: AbstractControl;
  emails: FormArray;

  filteredGroupsMultiple: any = [];
  originalGroups: Object[];
  disableEdit = true;
  sub: Subscription;
  private destroySubject: Subject<any> = new Subject();

  constructor(private fb: FormBuilder,
              private groupService: GroupService,
              private contactService: ZContactService,
              private mediaSelectionService: WMediaSelectionService,
              private photoUploadService: PhotoUploadService,
              private commonEventService: CommonEventService,
              private countryService: CountryService) {
    this.groupService.getAllGroups().then((res: any) => {
      this.originalGroups = res;
      _.map(res, (v: any) => {
        this.filteredGroupsMultiple.push({ value: v.name, display: v.name });
      });
    });
    this.resetDeletedObject();

    this.createForm();

    this.handleSelectCropEvent();


    this.emails.valueChanges.pipe(
      debounceTime(500),
      takeUntil(this.destroySubject)
    ).subscribe(val => {
      this.emails.controls.forEach(email => {
        if (email.dirty) {
          this.event.emit({ action: 'contact:contact:edit_email', payload: { item: email.value,
             emails: this.emails.value.map(em => em.value) } });
        }
      });
    });
  }

  ngOnInit(): void {
    this.countryService.getCountries()
      .pipe(
        takeUntil(this.destroySubject)
      )
      .subscribe(
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
    this.removeAll();

    if (this.contact && this.mode !== 'create') {

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
      (<FormControl>this.family_name).setValue(this.contact.family_name);
      (<FormControl>this.company).setValue(this.contact.company);
      (<FormControl>this.job_title).setValue(this.contact.job_title);
      (<FormControl>this.notes).setValue(this.contact.notes);
      // (<FormControl>this.groups).setValue(_.map(this.contact.groups, 'name'));
    }
  }

  ngOnDestroy() {
    this.destroySubject.next('');
    this.destroySubject.complete();
  }

  createForm() {
    this.form = this.fb.group({
      'phones': this.fb.array([this.initItem('phones')]),
      'emails': this.fb.array([this.initItem('emails')]),
      'addresses': this.fb.array([this.initItem('addresses')]),
      'media': this.fb.array([this.initItem('media')]),
      'name': [''],
      'family_name': [''],
      'company': [''],
      // 'groups': [''],
      'job_title': [''],
      'notes': ['']
    });

    this.name = this.form.controls['name'];
    this.family_name = this.form.controls['family_name'];
    this.company = this.form.controls['company'];
    // this.groups = this.form.controls['groups'];
    this.job_title = this.form.controls['job_title'];
    this.notes = this.form.controls['notes'];
    this.emails = this.form.controls['emails'] as FormArray;
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
        const data: any = { category: 'mobile', value: '' };
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
        const data: any = { category: 'work', value: '' };
        if (item) {
          formGroup = {
            id: [item.id, Validators.compose([Validators.required])],
            category: [item.category, Validators.compose([Validators.required])],
            value: [item.value, Validators.compose([Validators.required, CustomValidator.emailFormat])]
          };
        } else {
          formGroup = {
            category: [data.category, Validators.compose([Validators.required])],
            value: [data.value, Validators.compose([Validators.required, CustomValidator.emailFormat])]
          };
        }
        break;
      }
      case 'addresses': {
        const data: any = {
          category: 'work',
          address_line1: '',
          address_line2: '',
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
            address_line2: [item.address_line2],
            po_box: [item.po_box],
            city: [item.city],
            province: [item.province],
            postcode: [item.postcode],
            country: [item.country]
          };
        } else {
          formGroup = {
            category: [data.category],
            address_line1: [data.address_line1],
            address_line2: [data.address_line2],
            po_box: [data.po_box],
            city: [data.city],
            province: [data.province],
            postcode: [data.postcode],
            country: [data.country]
          };
        }
        break;
      }
      case 'media': {
        const data: any = { category: 'wthapps', value: '' };
        if (item) {
          formGroup = {
            id: [item.id, Validators.compose([Validators.required])],
            category: [item.category],
            value: [item.value, Validators.compose([CustomValidator.urlFormat])]
          };
        } else {
          formGroup = {
            category: [data.category],
            value: [data.value, Validators.compose([CustomValidator.urlFormat])]
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
    const control = <FormArray>this.form.controls[type];
    if (item) {
      control.push(this.initItem(type, item));
    } else {
      control.push(this.initItem(type));
    }
  }

  removeItem(type: string, i: number) {
    const control = <FormArray>this.form.controls[type];
    if (this.contact[type][i]) {
      this.deleteObjects[type].push({ ...this.contact[type][i], _destroy: true });
      this.contact[type].splice(i, 1);
    }

    if (type === 'emails') {
      this.event.emit({ action: 'contact:contact:remove_email', payload: this.form.controls[type]['controls'][i].value });
    }
    control.removeAt(i);
  }

  onChangeAvatar(): void {
    this.startCropPhoto(this.contact.profile_image);
  }

  setPhoto(base64Photo): void {
    Object.assign(this.contact, this.form.value);
    this.contact.avatar = base64Photo;
    this.upsertContact(this.contact);
  }

  startCropPhoto(photo: string) {
    event.preventDefault();
    this.commonEventService.broadcast({
      channel: 'SELECT_CROP_EVENT', action: 'SELECT_CROP:OPEN',
      payload: { currentImage: photo }
    });
  }


  handleSelectCropEvent() {
    this.commonEventService.filter((event: any) => event.channel === 'SELECT_CROP_EVENT')
      .pipe(
        takeUntil(this.destroySubject)
      )
      .subscribe((event: any) => {
        this.doEvent(event);
      });
  }

  doEvent(event: any) {
    console.log(event);
    switch (event.action) {
      case 'SELECT_CROP:DONE':
        this.setPhoto(event.payload);
        break;
      default:
        break;
    }
  }

  onSubmit(values: any): void {
    this.contact.name = values.name;
    this.contact.family_name = values.family_name;
    this.contact.company = values.company;
    this.contact.job_title = values.job_title;
    this.contact.emails = _.concat(values.emails, this.deleteObjects['emails']);
    this.contact.phones = _.concat(values.phones, this.deleteObjects['phones']);
    this.contact.media = _.concat(values.media, this.deleteObjects['media']);
    this.contact.addresses = _.concat(values.addresses, this.deleteObjects['addresses']);

    this.contact.notes = values.notes;

    this.upsertContact(this.contact);

    this.resetDeletedObject();
  }

  upsertContact(contact: Contact) {
    if (this.mode === 'create') {
      this.event.emit({ action: 'contact:contact:create', payload: { item: contact } });
    }
    if (this.mode === 'edit') {
      this.event.emit({ action: 'contact:contact:update', payload: { item: contact } });
    }
  }

  onCompleteChange(country: any, i: number) {
    const controlArray = <FormArray>this.form.get('phones');
    controlArray.controls[i].get('country_alpha_code').setValue(country.value);
  }

  private resetDeletedObject() {
    this.deleteObjects['emails'] = [];
    this.deleteObjects['phones'] = [];
    this.deleteObjects['addresses'] = [];
    this.deleteObjects['media'] = [];
  }

}
