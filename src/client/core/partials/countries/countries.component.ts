import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';

import { ICountry, CountryService } from './countries.service';

/**
 * This class represents the AppCardSmComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'wth-countries',
  template: `
    
  `,
  viewProviders: [
    CountryService
  ]
})
export class CountriesComponent implements OnChanges {
  @Input() data: ICountry;
  @Input() type: string = 'small';

  @Output() countryClicked: EventEmitter<string> = new EventEmitter<string>();

  country: ICountry;

  countryCode: string;

  category: string = '';

  errorMessage: string = '';

  ngOnChanges(): void {
    this.country = this.data;
    this.countryCode = this.data.code;
  }

  onClick(): void {
    this.countryClicked.emit(this.countryCode);
  }
}
