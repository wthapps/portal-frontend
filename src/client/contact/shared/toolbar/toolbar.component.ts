import { Component, OnInit, HostBinding, ViewChild } from '@angular/core';
import { ZContactService } from '../services/contact.service';
import { GoogleApiService } from '../services/google-api.service';
import { ZContactShareImportContactComponent } from '../modal/import-contact/import-contact.component';
import { CommonEvent } from '../../../core/shared/services/common-event/common-event';
import { CommonEventService } from '../../../core/shared/services/common-event/common-event.service';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-contact-shared-toolbar',
  templateUrl: 'toolbar.component.html',
  styleUrls: ['toolbar.component.css']
})
export class ZContactSharedToolbarComponent implements OnInit {
  @HostBinding('class') cssClass = 'page-body-control';
  @ViewChild('importContactSelect') importContactSelect: ZContactShareImportContactComponent;

  selectedContact: string;

  constructor(private contactService: ZContactService
  ) {
  }

  ngOnInit() {
    this.selectedContact = '3 contacts';
  }

  openAddModal() {
    console.log("openAddModal");
    this.contactService.contactAddContactService.sendIn({action: "open"});
  }

  openImportContactModal(options?: any) {
    this.importContactSelect.modal.open(options);
  }

  onImportOptionSelected(event: any) {
    console.debug('onImportOptionSelected: event - ', event);

    switch (event.name) {
      case 'google':
        console.log('google import contact');
        this.contactService.commonEventService.broadcast({action: 'contact:contact:open_import_progress'});

        break;
      case 'yahoo':
        break;
      case 'outlook':
        break;
      case 'others':
        break;
      default:
        console.error('Unhandled import option: ', event.name);
        break;
    }
  }

}
