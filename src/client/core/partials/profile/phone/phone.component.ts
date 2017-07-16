import { Component, Input, ViewChild, OnInit, HostBinding, Output, EventEmitter } from '@angular/core';
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
import { Constants } from '../../../shared/config/constants';
import { ProfileConfig } from '../profile-config.model';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'partials-profile-phone',
  templateUrl: 'phone.component.html'
})

export class PartialsProfilePhoneComponent implements OnInit {
  @Input() data: any;
  @ViewChild('modal') modal: ModalComponent;
  @Input() editable: boolean;
  @Input() config: ProfileConfig;

  @Output() eventOut: EventEmitter<any> = new EventEmitter<any>();

  @HostBinding('class') class = 'field-group';

  form: FormGroup;

  countriesCode: any;
  countriesNameCode: any;


  filteredCountriesCode: any[];

  phoneType: any = Constants.phoneType;

  constructor(private fb: FormBuilder, private countryService: CountryService, private apiBaseService: ApiBaseService) {
    this.form = fb.group({
      'phones': fb.array([
        this.initItem(),
      ])
    });
  }

  ngOnInit() {
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

  removeAll() {
    const control = <FormArray>this.form.controls['phones'];
    control.controls.length = 0;
    control.reset();
  }

  //phones
  initItem(item?: any) {
    if (item) {
      return this.fb.group({
        category: [item.category, Validators.compose([Validators.required])],
        country_alpha_code: [item.country_alpha_code, Validators.compose([Validators.required])],
        value: [item.value, Validators.compose([Validators.required, CustomValidator.phoneFormat])]
      });
    } else {
      return this.fb.group({
        category: ['', Validators.compose([Validators.required])],
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
    this.data.phones = values.phones;
    this.eventOut.emit(values);
    this.modal.close();
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

  handleDropdownClick() {
    this.filteredCountriesCode = [];

    //mimic remote call
    setTimeout(() => {
      this.filteredCountriesCode = this.countriesNameCode;
    }, 100);
  }

  getPhoneControls() {
    return (<FormGroup>(<FormGroup>this.form.get('phones')))['controls'];
  }
}
