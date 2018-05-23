import { Component, OnInit, HostBinding, ViewChild, Input } from '@angular/core';
import { ZContactService } from '../services/contact.service';
import { ZContactShareImportContactComponent } from '../modal/import-contact/import-contact.component';
import { ICloudOAuthComponent } from '../modal/import-contact/icloud/icloud-oauth.component';
import { CommonEventService } from '../../../shared/services/common-event/common-event.service';

import { Constants } from '../../../shared/constant/config/constants';
import {Location} from '@angular/common';

declare var _: any;

@Component({
  selector: 'z-contact-shared-toolbar',
  templateUrl: 'toolbar.component.html',
  styleUrls: ['toolbar.component.scss']
})
export class ZContactSharedToolbarComponent implements OnInit {
  @HostBinding('class') cssClass = 'page-body-control';
  @ViewChild('importContactSelect') importContactSelect: ZContactShareImportContactComponent;
  @ViewChild('iCloudOAuthModal') iCloudOAuthModal: ICloudOAuthComponent;

  @Input() pageTitle: string = ''; // TODO will be removed
  @Input() hasBack: boolean = false;
  @Input() currentPage: string;
  selectedContact: string;

  tooltip: any = Constants.tooltip;

  constructor(
    public contactService: ZContactService,
    public location: Location,
    private commonEventService: CommonEventService
  ) {
  }

  ngOnInit() {
    this.selectedContact = '3 contacts';
  }

  openAddModal() {
    console.log('openAddModal');
  }


  openImportContactModal(options?: any) {
    this.importContactSelect.modal.open(options);
  }

  back() {
    this.location.back();
  }

  onImportOptionSelected(event: any) {
    switch (event.provider) {
      case 'google':
      case 'apple':
      case 'microsoft':
      case 'linkedin':
      case 'import_from_file':
        this.commonEventService.broadcast({
          channel: 'contact:contact:actions',
          action: 'contact:contact:import_contact',
          payload: event
        });
        break;
      default:
        console.warn('Unhandled import option: ', event.provider);
        break;
    }
  }

}
