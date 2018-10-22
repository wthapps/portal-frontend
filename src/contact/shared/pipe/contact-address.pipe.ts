import { Pipe, PipeTransform } from '@angular/core';
import { Address } from '@contacts/contact/address.model';

@Pipe({ name: 'contactAddressPipe' })
export class ContactAddressPipe implements PipeTransform {
  transform(item: Address) {
    const {
      address_line1,
      address_line2,
      city,
      province,
      postcode,
      country
    } = item;
    console.log('address_line2:', item, address_line2);

    let full_address = address_line1 || '';
    if (address_line2 && address_line2.trim() !== '')
      full_address += `<br> ${address_line2}`;
    if (city || province || postcode)
      full_address += `<br> ${city} ${province} ${postcode}`;
    if (country) full_address += `<br> ${country}`;
    return full_address;
  }
}
