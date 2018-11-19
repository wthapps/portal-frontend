import { Component, Input, ViewChild, OnInit, HostBinding, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray
} from '@angular/forms';

import { BsModalComponent } from 'ng2-bs3-modal';
import { CustomValidator } from '../../../shared/validator/custom.validator';
import { CountryService } from '../../../shared/components/countries/countries.service';
import { ApiBaseService } from '../../../services/apibase.service';
import { Constants } from '../../../constant/config/constants';
import { Mixins  } from '../../../design-patterns/decorator/mixin-decorator';
import { ProfileFormMixin } from '../../../shared/mixins/form/profile/profile-form.mixin';

declare var _: any;

@Mixins([ProfileFormMixin])
@Component({
    selector: 'w-user-phones',
  templateUrl: 'phone-list.component.html',
  encapsulation: ViewEncapsulation.None
})


export class PhoneListComponent implements OnInit, ProfileFormMixin {
  @Input() data: any;
  @ViewChild('modal') modal: BsModalComponent;
  @Input() editable: boolean;

  @Output() eventOut: EventEmitter<any> = new EventEmitter<any>();

  @HostBinding('class') class = 'field-group';

  form: FormGroup;
  phones: FormArray;

  type = 'phones';

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
      phones: fb.array([ this.initItem() ])
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
        id: [item.id, Validators.compose([Validators.required])],
        category: [item.category, Validators.compose([Validators.required])],
        country_alpha_code: [item.country_alpha_code],
        value: [item.value, Validators.compose([Validators.required, CustomValidator.phoneFormat])]
      });
    } else {
      return this.fb.group({
        category: ['mobile', Validators.compose([Validators.required])],
        country_alpha_code: [''],
        value: ['', Validators.compose([Validators.required, Validators.maxLength(20), CustomValidator.phoneFormat])]
      });
    }
  }

  addItem(item?: any) {
    this.phones = <FormArray>this.form.controls.phones;
    if (item) {
      this.phones.push(this.initItem(item));
    } else {
      this.phones.push(this.initItem());
    }
  }

  onOpenModal() {
    this.modal.open();
    this.removeAll();
    if (this.data.phones.length > 0) {
      this.data.phones.map(v => {
        this.addItem(v);
      });
    } else {
      this.addItem();
    }
  }

  filterCountriesCode(event: any) {
    this.filteredCountriesCode = [];
    let brand;
    for (let i = 0; i < this.countriesNameCode.length; i++) {
      brand = this.countriesNameCode[i];
      if (brand.toLowerCase().indexOf(event.query.toLowerCase()) === 0) {
        this.filteredCountriesCode.push(brand);
      }
    }
  }
}
