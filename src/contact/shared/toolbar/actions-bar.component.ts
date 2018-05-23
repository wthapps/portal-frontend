import { Component, Input, EventEmitter, Output } from '@angular/core';
import { ZContactService } from '../services/contact.service';
import { EmitEventMixin } from '../../../shared/shared/mixins/shared/emit-event.mixin';
import { Mixin } from "../../../shared/design-patterns/decorator/mixin-decorator";

import { Constants } from '../../../shared/constant/config/constants';
import { CommonEventService } from '@wth/shared/services';


@Mixin([EmitEventMixin])
@Component({
  selector: 'z-contact-shared-actions-bar',
  templateUrl: 'actions-bar.component.html',
  styleUrls: ['actions-bar.component.scss']
})
export class ZContactSharedActionsBarComponent implements EmitEventMixin {
  // Show or not
  @Input() showSocial: boolean = true;
  @Input() showChat: boolean = true;
  @Input() showNumber: boolean = true;
  @Input() showViewDetail: boolean = true;
  @Input() showEdit: boolean = true;
  @Input() showTag: boolean = true;
  @Input() showInvitation: boolean = true;
  @Input() showQuickInvitation: boolean = false;
  // Toggle
  @Input() toggleFavourite: boolean = false;
  @Input() toggleBlacklist: boolean = false;
  // Number
  @Input() number: number;
  // Order
  @Input() order: boolean = false;
  @Input() data: any = {};

  @Output() eventOut: EventEmitter<any> = new EventEmitter<any>();
  emitEvent: (value: any) => void;

  tooltip: any = Constants.tooltip;
  readonly CONNECT_STATUS: any = Constants.contactConnectStatus;
  readonly UNCONNECT_STATUS = [1, 2, 4];

  constructor(public contactService: ZContactService,
              private commonService: CommonEventService) {

  }

  mergeDuplicate() {
    this.commonService.broadcast({channel: 'contact:contact:actions:merge', action: 'open'});
    // this.contactService.mergeDuplicateContacts().then((res: any) => console.log('merge duplicate is DONE'));
  }

  sendRequest(contact: any) {
    this.contactService.sendRequest(contact);
  }
}
