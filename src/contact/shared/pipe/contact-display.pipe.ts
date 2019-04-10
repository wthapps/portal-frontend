import { Pipe, PipeTransform } from '@angular/core';
import { Contact } from '../../contact/contact.model';

@Pipe({ name: 'contactDisplayPipe' })
export class ContactDisplayPipe implements PipeTransform {
  transform(contact: Contact, contactsSortBy = 'first_name'): Contact {
    // Display profile image, first_name, last_name based on linked public cards
    const cloneContact = { ...contact };
    if (contact.public_cards && contact.public_cards.length > 0) {
      const { profile_image, first_name, last_name } = contact.public_cards[0];
      if (contact.using_default_profile_image) {
        cloneContact.profile_image = profile_image;
      }
      if (this.isEmpty(contact.name) && this.isEmpty(contact.family_name)) {
        cloneContact.name = first_name;
        cloneContact.family_name = last_name;
      }
    }
    return cloneContact;
  }

  isEmpty(str) {
    return !(str && str.trim().length > 0);
  }
}
