import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { ModalComponent } from 'ng2-bs3-modal/components/modal';

@Component({
  moduleId: module.id,
  selector: 'icloud-oauth-modal',
  templateUrl: 'icloud-oauth.component.html'
})

export class ICloudOAuthComponent {
  @ViewChild('modal') modal: ModalComponent;
  @Output() optionSelected: EventEmitter<any> = new EventEmitter<any>();

  readonly OAUTH_LIST: any = [
    {name: 'google', text: 'Google Contacts', image: '/assets/images/icons/contact-book-providers-64x64.svg'},
    {name: 'apple', text: 'iCloud Contacts', image: '/assets/images/icons/contact-book-providers-64x64.svg'},
    {name: 'outlook', text: 'Outlook Contacts', image: '/assets/images/icons/contact-book-providers-64x64.svg'}
  ];

  open() {
    this.modal.open().then();
  }
  // Format: { name }
  onOptionSelected(options: any) {
    this.optionSelected.emit(options);
    this.modal.close();
  }

  signIn(event: any) {
    console.log('signing in:::', event);
  }
}
