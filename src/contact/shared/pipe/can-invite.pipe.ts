import { Pipe, PipeTransform } from '@angular/core';
import { Contact } from './../../contact/contact.model';

declare let _: any;

@Pipe({name: 'canInvite'})
export class CanInvitePipe implements PipeTransform {
  transform(contact: Contact) {
    return contact.emails.some(email => !email.wthapps_user);
  }
}
