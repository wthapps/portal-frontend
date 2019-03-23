import { Pipe, PipeTransform } from '@angular/core';
import { ICountry } from '../components/countries/countries.service';

/*
 * Converts urlTransform into http:// or https://
 */
@Pipe({ name: 'countryCode2Value' })
export class CountryCode2ValuePipe implements PipeTransform {
  transform(code: string, countryList: ICountry[]): any {
    console.log('transform country code: ', code, countryList.length);

    if (countryList && countryList.length > 0) {
      const c = countryList.find(p => p.code === code);
      return c ? c.name : '';
    }
    return '';
  }
}
