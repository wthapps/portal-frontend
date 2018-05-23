import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { ApiBaseService } from '@shared/services/apibase.service';
import { CountryService } from '@shared/shared/components/countries/countries.service';
import { WthConfirmService } from '@shared/shared/components/confirmation/wth-confirm.service';
import { ZContactService } from '@contacts/shared/services/contact.service';
import { DEFAULT_SETTING } from '@contacts/shared/config/constants';

declare var _: any;

@Component({
  selector: 'z-contact-setting',
  templateUrl: 'contact-settings.component.html'
})
export class SettingsComponent implements OnInit {
  item: any;
  form: FormGroup;

  countriesCode: any;
  countriesNameCode: any;
  filteredCountriesCode: any[];

  constructor(
    private fb: FormBuilder,
    private countryService: CountryService,
    private apiBaseService: ApiBaseService,
    private contactService: ZContactService,
    private wthConfirmService: WthConfirmService
  ) {
    // Init default
    this.form = this.fb.group(DEFAULT_SETTING);
  }

  ngOnInit() {
    this.apiBaseService
      .get(`contact/contacts/settings`)
      .toPromise()
      .then((res: any) => {
        this.setSettingForm(res.data);
      });
    this.countryService.getCountries().subscribe((res: any) => {
      this.countriesCode = res;
      this.countriesNameCode = res.map((v: any) => {
        return v.name + ' (' + v.dial_code + ')';
      });
    });
  }

  onSubmit() {
    this.apiBaseService
      .post(`contact/contacts/update_settings`, {
        contact_setting_attributes: this.form.value
      })
      .toPromise()
      .then(res => this.setSettingForm(res.data));
  }

  cancel() {
    console.log('cancel');
  }

  confirmReset() {
    this.wthConfirmService.confirm({
      message: 'Are you sure you want to reset settings?',
      header: 'Reset Default',
      accept: () => {
        this.apiBaseService
          .post(`contact/contacts/update_settings`, {
            contact_setting_attributes: Object.assign(
              {},
              this.form.value,
              DEFAULT_SETTING
            )
          })
          .toPromise()
          .then((res: any) => this.setSettingForm(res.data));
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
      if (brand.toLowerCase().indexOf(event.query.toLowerCase()) === 0) {
        this.filteredCountriesCode.push(brand);
      }
    }
  }

  private setSettingForm(data: any) {
    if (data && data.phone_default_code) {
      const settings = {
        id: data.id,
        phone_default_code: data.phone_default_code,
        contacts_sort_by: data.contacts_sort_by
      };
      this.form = this.fb.group(settings);

      this.contactService.setUserSettings(settings);
    }
  }
}
