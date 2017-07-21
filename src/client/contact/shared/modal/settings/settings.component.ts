import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { ApiBaseService } from '../../../../core/shared/services/apibase.service';
import { CountryService } from "../../../../core/partials/countries/countries.service";

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-contact-shared-setting',
  templateUrl: 'settings.component.html'
})

export class ZContactSharedSettingsComponent implements OnInit {
  @ViewChild('modal') modal: ModalComponent;
  item: any;
  form: FormGroup;

  countriesCode: any;
  countriesNameCode: any;
  filteredCountriesCode: any[];

  constructor(private fb: FormBuilder, private countryService: CountryService, private apiBaseService: ApiBaseService) {
    // Init default
    this.form = this.fb.group({
      'phone_default_code': ['Albania (+355)'],
      'contacts_sort_by': ['first_name']
    });
  }

  ngOnInit() {
    this.apiBaseService.get(`contact/contacts/settings`).subscribe((res: any) => {
      if(res.data && res.data.phone_default_code) {
        this.form = this.fb.group({
          'id': res.data.id,
          'phone_default_code': res.data.phone_default_code,
          'contacts_sort_by': res.data.contacts_sort_by
        });
      }
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

  submit() {
    this.apiBaseService.post(`contact/contacts/update_settings`, {contact_setting_attributes: this.form.value}).subscribe((res: any) => {

    });
    this.modal.close();
  }

  open() {
    this.modal.open();
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
}
