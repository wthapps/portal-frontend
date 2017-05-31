import { Component, Input, ViewChild, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray
} from '@angular/forms';

import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { CustomValidator } from '../../../shared/validator/custom.validator';
import { CountryService } from '../../countries/countries.service';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'partials-profile-phone',
  templateUrl: 'phone.component.html'
})

export class PartialsProfilePhoneComponent implements OnInit {
  @Input('data') data: any;
  @ViewChild('modal') modal: ModalComponent;

  form: FormGroup;

  countriesCode: any;

  phoneType: any = [
    {
      type: 'mobile',
      name: 'Mobile'
    },
    {
      type: 'fax',
      name: 'Fax'
    },
    {
      type: 'other',
      name: 'Other'
    },
  ];

  constructor(private fb: FormBuilder, private countryService: CountryService) {
    this.form = fb.group({
      'phones': fb.array([
        this.initItem(),
      ])
    });

    console.log(this.form);
  }

  ngOnInit() {
    this.countryService.getCountries().subscribe(
      (res: any) => {
        this.countriesCode = res;
      });

  }

  removeAll() {
    const control = <FormArray>this.form.controls['phones'];
    control.controls.length = 0;
    control.reset();
  }

  //phones
  initItem(item?: any) {
    if (item) {
      return this.fb.group({
        type: [item.type, Validators.compose([Validators.required])],
        phone_prefix: [item.phone_prefix, Validators.compose([Validators.required])],
        phone: [item.phone, Validators.compose([Validators.required, CustomValidator.phoneFormat])]
      });
    } else {
      return this.fb.group({
        type: ['', Validators.compose([Validators.required])],
        phone_prefix: ['', Validators.compose([Validators.required])],
        phone: ['', Validators.compose([Validators.required, CustomValidator.phoneFormat])]
      });
    }
  }

  addItem(item?: any) {
    const control = <FormArray>this.form.controls['phones'];
    if (item) {
      control.push(this.initItem(item));
    } else {
      control.push(this.initItem());
    }
  }

  removeItem(i: number) {
    const control = <FormArray>this.form.controls['phones'];
    control.removeAt(i);
  }

  onOpenModal() {
    this.modal.open();
    let _this = this;

    _this.removeAll();

    _.map(this.data, (v: any)=> {
      _this.addItem(v);
    });
  }


  onSubmit(values: any): void {
    console.log(values);
  }
}
