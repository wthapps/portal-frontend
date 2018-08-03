import { Component, OnInit, HostBinding, ViewChild, Input } from '@angular/core';
import { ZContactService } from '../services/contact.service';
import { ZContactShareImportContactComponent } from '../modal/import-contact/import-contact.component';
import { ICloudOAuthComponent } from '../modal/import-contact/icloud/icloud-oauth.component';
import { CommonEventService } from '../../../shared/services/common-event/common-event.service';

import { Constants } from '../../../shared/constant/config/constants';
import { Location } from '@angular/common';

declare var _: any;

@Component({
  selector: 'z-contact-shared-toolbar',
  templateUrl: 'toolbar.component.html',
  styleUrls: ['toolbar.component.scss']
})
export class ZContactSharedToolbarComponent implements OnInit {
  @HostBinding('class') cssClass = 'page-body-control';

  @Input() pageTitle: string = ''; // TODO will be removed
  @Input() hasBack: boolean = false;
  @Input() currentPage: string;
  selectedContact: string;

  tooltip: any = Constants.tooltip;
  otherContactsInfo = 'Other Contacts are people you interacted with but did not add them to your Contacts books';

  constructor(
    public contactService: ZContactService,
    public location: Location,
    private commonEventService: CommonEventService
  ) {
  }

  ngOnInit() {
    this.selectedContact = '3 contacts';
  }

  back() {
    this.location.back();
  }

  onClearSelected() {
    this.contactService.resetSelectedObjects();
  }
}
