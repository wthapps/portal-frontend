import { Component, OnInit, HostBinding } from '@angular/core';
import { ZContactService } from '../services/contact.service';
import { GoogleApiService } from '../services/google-api.service';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-contact-shared-toolbar',
  templateUrl: 'toolbar.component.html',
  styleUrls: ['toolbar.component.css']
})
export class ZContactSharedToolbarComponent implements OnInit {
  @HostBinding('class') cssClass = 'page-body-control';

  selectedContact: string;

  constructor(private contactService: ZContactService,
              private gapi: GoogleApiService) {
  }

  ngOnInit() {
    this.selectedContact = '3 contacts';
  }

  openAddModal() {
    console.log("openAddModal");
    this.contactService.contactAddContactService.sendIn({action: "open"});
  }

  importContact() {
    console.log('importContact: ');
    this.gapi.importContact();
  }
}
