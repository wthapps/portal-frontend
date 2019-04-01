import { Pipe, PipeTransform } from '@angular/core';
import { Address } from '../models/address.model';

@Pipe({ name: 'userAddress' })
export class UserAddressPipe implements PipeTransform {
  transform(item: Address) {
    const {
      address_line1,
      address_line2,
      city,
      province,
      postcode,
      country
    } = item;

    let full_address = address_line1 || '';
    if (address_line2 && address_line2.trim() !== '')
      full_address += `<br> ${address_line2}`;
    if (city || province || postcode)
      full_address += `<br> ${city} ${province} ${postcode}`;
    if (country) full_address += `<br> ${country}`;
    return full_address;
  }
}
