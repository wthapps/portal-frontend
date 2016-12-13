import { Component, OnInit, OnChanges, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { ApiBaseServiceV2 } from '../../../../shared/services/apibase.service.v2';
import { UserService } from '../../../../shared/services/user.service';
import { LoadingService } from '../../../../partials/loading/loading.service';
import { HdModalComponent } from '../../../shared/ng2-hd/modal/components/modal';

import {
  FormGroup,
  AbstractControl,
  FormBuilder,
  Validators,
  FormControl,
  FormArray
} from '@angular/forms';
import { CustomValidator } from '../../../../shared/validator/custom.validator';
import { CountryService } from '../../../../partials/countries/countries.service';
import { SocialService } from '../../services/social.service';

declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-social-profile-form-contact',
  templateUrl: 'contact.component.html'
})

export class ZSocialProfileFormContactComponent implements OnInit, OnChanges {

  @ViewChild('modal') modal: HdModalComponent;
  @Input() data: any;
  @Input() action: string;
  @Output() updated: EventEmitter<any> = new EventEmitter<any>();

  errorMessage: string = '';
  list: any = [];

  countriesCode: any;

  form: FormGroup;

  constructor(private fb: FormBuilder,
              private apiBaseServiceV2: ApiBaseServiceV2,
              private countryService: CountryService,
              private loadingService: LoadingService,
              private socialService: SocialService,
              private userService: UserService) {
    this.form = fb.group({
      'emails': fb.array([
        this.initEmail(),
      ]),
      'phones': fb.array([
        this.initPhone(),
      ]),
      'addresses': fb.array([
        this.initAddress(),
      ])
    });
  }

  ngOnInit() {
    this.removeAll();

    this.countryService.getCountries().subscribe(data => this.countriesCode = data);
  }

  ngOnChanges() {
    this.removeAll();
    let _this = this;
    if (this.data) {
      this.removeAll();

      let additional_emails_edit = this.data.email;
      _.map(additional_emails_edit, (v)=> {
        _this.addEmail(v);
      });
      let additional_phones_edit = this.data.phone;
      _.map(additional_phones_edit, (v)=> {
        _this.addPhone(v);
      });
      let additional_address_edit = this.data.address;
      _.map(additional_address_edit, (v)=> {
        _this.addAddress(v);
      });
    }
  }

  removeAll() {
    const control_email = <FormArray>this.form.controls['emails'];
    const control_phone = <FormArray>this.form.controls['phones'];
    const control_address = <FormArray>this.form.controls['addresses'];
    for (let i = 0; i < control_email.length; i++) {
      control_email.removeAt(i);
      control_email.reset();
    }
    for (let i = 0; i < control_phone.length; i++) {
      control_phone.removeAt(i);
      control_phone.reset();
    }
    for (let i = 0; i < control_address.length; i++) {
      control_address.removeAt(i);
      control_address.reset();
    }
  }

  //Email
  initEmail(email?: any) {
    if (email) {
      return this.fb.group({
        email: [email, Validators.compose([CustomValidator.emailFormat])]
      });
    } else {
      return this.fb.group({
        email: ['', Validators.compose([CustomValidator.emailFormat])]
      });
    }
  }

  addEmail(email?: any) {
    const control = <FormArray>this.form.controls['emails'];
    if (email) {
      control.push(this.initEmail(email));
    } else {
      control.push(this.initEmail());
    }

  }

  removeEmail(i: number) {
    const control = <FormArray>this.form.controls['emails'];
    control.removeAt(i);
  }


  //Phone
  initPhone(phone?: any) {
    if (phone) {
      return this.fb.group({
        phone: [phone]
      });
    } else {
      return this.fb.group({
        phone: ['']
      });
    }
  }

  addPhone(phone?: any) {
    const control = <FormArray>this.form.controls['phones'];
    if (phone) {
      control.push(this.initPhone(phone));
    } else {
      control.push(this.initPhone());
    }
  }

  removePhone(i: number) {
    const control = <FormArray>this.form.controls['phones'];
    control.removeAt(i);
  }

  //Address
  initAddress(address?: any) {
    if (address) {
      return this.fb.group({
        street: [address.street],
        city: [address.city],
        country: [address.country]
      });
    } else {
      return this.fb.group({
        street: [''],
        city: [''],
        country: ['']
      });
    }
  }

  addAddress(address?: any) {
    const control = <FormArray>this.form.controls['addresses'];
    if (address) {
      control.push(this.initAddress(address));
    } else {
      control.push(this.initAddress());
    }
  }

  removeAddress(i: number) {
    const control = <FormArray>this.form.controls['addresses'];
    control.removeAt(i);
  }


  onHideModal() {
    this.modal.close();
  }

  onSubmit(values: any): void {

    console.log(values);

    // get links if link is not empty
    /*let emails_filter = [];
    _.map(values.email, (v)=> {
      if (v.email != '') {
        emails_filter.push(v);
      }
    });*/

    let body = JSON.stringify({
      email: values.emails,
      phone: values.phones,
      address: values.addresses
    });

    console.log('body:', body);

    this.apiBaseServiceV2.put(`zone/social_network/users/${this.data.uuid}`, body)
      .subscribe((result: any) => {
          console.log(result);
          //this.updated.emit(result.data);
        },
        error => {
          console.log(error);
        }
      );

    this.modal.close();
  }
}
