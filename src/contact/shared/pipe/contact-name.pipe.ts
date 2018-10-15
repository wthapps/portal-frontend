import { Pipe, PipeTransform } from '@angular/core';
import { Contact } from '@contacts/contact/contact.model';

declare let _: any;

@Pipe({name: 'contactNamePipe'})
export class ContactNamePipe implements PipeTransform {
  transform(contact: Contact, contactsSortBy = 'first_name') {
    const {name, family_name} = contact;
    if (!family_name || !family_name.trim())
      return name;
    if (contactsSortBy === 'first_name') {
      return `${name} ${family_name}`;
    } else {
      // Contacts sort by last name
      return `${family_name}, ${name}`;
    }
  }
}
