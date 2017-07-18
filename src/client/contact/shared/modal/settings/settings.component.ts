import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { CountryService } from '../../../../core/partials/countries/countries.service';

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
  country_alpha_code: AbstractControl;
  sort_by: AbstractControl;

  countriesCode: any;
  countriesNameCode: any;
  filteredCountriesCode: any[];

  constructor(private fb: FormBuilder, private countryService: CountryService) {
    this.form = this.fb.group({
      'country_alpha_code': ['Albania (+355)'],
      'sort_by': ['first_name']
    });
    this.country_alpha_code = this.form.controls['country_alpha_code'];
    this.sort_by = this.form.controls['sort_by'];
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

  submit() {
    console.log(this.form.value);
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
