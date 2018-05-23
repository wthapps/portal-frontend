import { Component, Input, ViewChild, OnInit, HostBinding, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray
} from '@angular/forms';

import { BsModalComponent } from 'ng2-bs3-modal';
import { CustomValidator } from '../../../validator/custom.validator';
import { CountryService } from '../../countries/countries.service';
import { ApiBaseService } from '../../../../services/apibase.service';
import { Constants } from '../../../../constant/config/constants';
import { Mixin } from '../../../../design-patterns/decorator/mixin-decorator';
import { ProfileFormMixin } from '../../../mixins/form/profile/profile-form.mixin';

declare var _: any;

@Mixin([ProfileFormMixin])
@Component({
    selector: 'partials-profile-phone',
  templateUrl: 'phone.component.html',
  styleUrls: ['phone.component.scss'],
  encapsulation: ViewEncapsulation.None
})


export class PartialsProfilePhoneComponent implements OnInit, ProfileFormMixin {
  @Input() data: any;
  @ViewChild('modal') modal: BsModalComponent;
  @Input() editable: boolean;

  @Output() eventOut: EventEmitter<any> = new EventEmitter<any>();

  @HostBinding('class') class = 'field-group';

  form: FormGroup;
  type: string = 'phones';

  countriesCode: any;
  countriesNameCode: any;

  filteredCountriesCode: Array<any> = new Array<any>();

  phoneType: any = Constants.phoneType;

  deleteObjects: any = [];

  removeItem: (i: number, item: any) => void;
  onSubmit: (values: any) => void;
  removeAll: () => void;
  getFormControls: () => any;

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

  //phones
  initItem(item?: any) {
    if (item) {
      return this.fb.group({
        category: [item.category, Validators.compose([Validators.required])],
        country_alpha_code: [item.country_alpha_code],
        id: [item.id, Validators.compose([Validators.required])],
        value: [item.value, Validators.compose([Validators.required, CustomValidator.phoneFormat])]
      });
    } else {
      return this.fb.group({
        category: ['mobile', Validators.compose([Validators.required])],
        country_alpha_code: [''],
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

  onOpenModal() {
    this.modal.open();
    this.removeAll();
    _.map(this.data.phones, (v: any)=> {
      this.addItem(v);
    });
    this.addItem();
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
