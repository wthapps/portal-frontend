import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Contact } from '../contact.model';
import { Address } from '../address.model';

@Component({
  moduleId: module.id,
  selector: 'contact-edit',
  templateUrl: 'contact-edit.component.html',
  styleUrls: ['contact-edit.component.css']
})
export class ContactEditComponent {

  @Input() contact: Contact;
  @Input() mode: string;
  @Output() event: EventEmitter<any> = new EventEmitter<any>();

  phoneCategories: Array<any> = [
    { value: 'mobile', text: 'Mobile'},
    { value: 'home', text: 'Home'},
    { value: 'work', text: 'Work'},
    { value: 'main', text: 'Main'},
    { value: 'fax', text: 'Fax'},
    { value: 'other', text: 'Other'}
  ];

  categories: Array<any> = [
    { value: 'work', text: 'Work'},
    { value: 'home', text: 'Home'},
    { value: 'other', text: 'Other'}
  ];

  mediaCategories: Array<any> = [
    { value: 'wthapps', text: 'WTHApps'},
    { value: 'facebook', text: 'Facebook'},
    { value: 'googleplus', text: 'Google Plus'},
    { value: 'twitter', text: 'Twitter'},
    { value: 'other', text: 'Other'}

  ];

  doEvent(event: any) {

  }

  get addresses(): Array<Address> {
    return this.contact.addresses;
  }
}
