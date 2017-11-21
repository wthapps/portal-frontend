import { Component, OnInit, HostBinding, ViewChild, Input } from '@angular/core';
import { ZContactService } from '../services/contact.service';
import { GoogleApiService } from '../services/google-api.service';
import { ZContactShareImportContactComponent } from '../modal/import-contact/import-contact.component';
import { CommonEvent } from '../../../core/shared/services/common-event/common-event';
import { CommonEventService } from '../../../core/shared/services/common-event/common-event.service';
import { Constants } from '../../../core/shared/config/constants';
import { ICloudOAuthComponent } from '../modal/import-contact/icloud/icloud-oauth.component';

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
  @ViewChild('iCloudOAuthModal') iCloudOAuthModal: ICloudOAuthComponent;

  @Input() pageTitle: string = ''; // TODO will be removed
  @Input() hasBack: boolean = false;
  selectedContact: string;

  tooltip: any = Constants.tooltip;

  constructor(private contactService: ZContactService, private commonEventService: CommonEventService) {
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
        console.error('Unhandled import option: ', event.provider);
        break;
    }
  }

}
