import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { ZContactService } from '../../services/contact.service';
import { ModalComponent } from 'ng2-bs3-modal/components/modal';

@Component({
  moduleId: module.id,
  selector: 'z-contact-share-import-contact',
  templateUrl: 'import-contact.component.html'
})

export class ZContactShareImportContactComponent implements OnInit {
  @ViewChild('modal') modal: ModalComponent;
  @Output() optionSelected: EventEmitter<any> = new EventEmitter<any>();

  readonly OAUTH_LIST: any = [
    {name: 'yahoo', text: 'Yahoo mail', image: '/assets/images/icons/yahoo.png'},
    {name: 'google', text: 'Google mail', image: '/assets/images/icons/google.png'},
    {name: 'outlook', text: 'Outlook mail', image: '/assets/images/icons/live.png'},
    // {name: 'others', text: 'Other providers', image: ''},
  ];

  constructor(private contactService: ZContactService) {

  }

  ngOnInit() {
    
  }

  // Format: { name }
  onOptionSelected(options: any) {
    this.optionSelected.emit(options);
    this.modal.close();
  }
}
