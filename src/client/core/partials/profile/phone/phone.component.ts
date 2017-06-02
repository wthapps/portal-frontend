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
import { ApiBaseService } from '../../../shared/services/apibase.service';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'partials-profile-phone',
  templateUrl: 'phone.component.html'
})

export class PartialsProfilePhoneComponent implements OnInit {
  @Input('data') data: any;
  @ViewChild('modal') modal: ModalComponent;
  @Input() editable: boolean;

  form: FormGroup;

  countriesCode: any;

  phoneType: any = [
    {
      kind_of: 'mobile',
      name: 'Mobile'
    },
    {
      kind_of: 'fax',
      name: 'Fax'
    },
    {
      kind_of: 'other',
      name: 'Other'
    },
  ];

  constructor(private fb: FormBuilder, private countryService: CountryService, private apiBaseService: ApiBaseService) {
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
        kind_of: [item.kind_of, Validators.compose([Validators.required])],
        country_alpha_code: [item.country_alpha_code, Validators.compose([Validators.required])],
        value: [item.value, Validators.compose([Validators.required, CustomValidator.phoneFormat])]
      });
    } else {
      return this.fb.group({
        kind_of: ['', Validators.compose([Validators.required])],
        country_alpha_code: ['', Validators.compose([Validators.required])],
        value: ['', Validators.compose([Validators.required, CustomValidator.phoneFormat])]
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

    _.map(this.data.phones, (v: any)=> {
      _this.addItem(v);
    });
  }


  onSubmit(values: any): void {
    this.apiBaseService.put('zone/social_network/users/' + this.data.uuid, values).subscribe((res:any) => {
      this.removeAll();
      this.data = res.data;
      _.map(this.data.emails, (v: any)=> {
        this.addItem(v);
      });
      this.modal.close();
    });
  }
}
