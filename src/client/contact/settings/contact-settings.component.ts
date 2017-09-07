import { Component, OnInit, ViewChild } from '@angular/core';

import 'rxjs/add/operator/toPromise';

import { ApiBaseService } from '../../core/shared/services/apibase.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CountryService } from '../../core/shared/components/countries/countries.service';
import { ConfirmationService } from 'primeng/components/common/confirmationservice';

declare var _: any;

const DEFAULT_SETTING: any = {
  'phone_default_code': 'Albania (+355)',
  'contacts_sort_by': 'first_name'
};

@Component({
  moduleId: module.id,
  selector: 'z-contact-setting',
  templateUrl: 'contact-settings.component.html'
})
export class ZContactSettingsComponent implements OnInit {
  item: any;
  form: FormGroup;

  countriesCode: any;
  countriesNameCode: any;
  filteredCountriesCode: any[];

  constructor(private fb: FormBuilder, private countryService: CountryService,
              private apiBaseService: ApiBaseService,
              private confirmationService: ConfirmationService) {
    // Init default
    this.form = this.fb.group(DEFAULT_SETTING);
  }

  ngOnInit() {
    this.apiBaseService.get(`contact/contacts/settings`).toPromise().then((res: any) => {
      this.setSettingForm(res.data);
    });
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

  onSubmit() {
    this.apiBaseService.post(`contact/contacts/update_settings`, {contact_setting_attributes: this.form.value})
      .toPromise();
  }

  cancel() {
    console.log('cancel');
  }

  confirmReset() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to reset settings?',
      header: 'Reset Default',
      accept: () => {
        this.apiBaseService.post(`contact/contacts/update_settings`, {contact_setting_attributes: Object.assign({}, this.form.value, DEFAULT_SETTING) })
          .toPromise().then((res: any) => this.setSettingForm(res.data));
      }
    });
  }

  open() {
    console.log('open');
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

  private setSettingForm(data: any) {
    if (data && data.phone_default_code) {
      this.form = this.fb.group({
        'id': data.id,
        'phone_default_code': data.phone_default_code,
        'contacts_sort_by': data.contacts_sort_by
      });
    }
  }

}
