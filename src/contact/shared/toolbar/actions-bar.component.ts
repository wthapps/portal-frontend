import { Component, Input, EventEmitter, Output } from '@angular/core';
import { ZContactService } from '../services/contact.service';
import { EmitEventMixin } from '../../../shared/shared/mixins/shared/emit-event.mixin';
import { Mixins  } from '../../../shared/design-patterns/decorator/mixin-decorator';

import { Constants } from '../../../shared/constant/config/constants';
import { CommonEventService } from '@wth/shared/services';
import { ToastsService } from '@shared/shared/components/toast/toast-message.service';


@Mixins([EmitEventMixin])
@Component({
  selector: 'z-contact-shared-actions-bar',
  templateUrl: 'actions-bar.component.html',
  styleUrls: ['actions-bar.component.scss']
})
export class ZContactSharedActionsBarComponent implements EmitEventMixin {
  // Show or not
  @Input() showSocial = true;
  @Input() showChat = true;
  @Input() showNumber = true;
  @Input() showViewDetail = true;
  @Input() showMergeContacts = false;
  @Input() showEdit = true;
  @Input() showTag = true;
  @Input() showInvitation = false;
  @Input() showQuickInvitation = false;
  @Input() showAddToContacts = false;
  @Input() showFavorite = true;
  // Toggle
  @Input() toggleFavourite = false;
  @Input() toggleBlacklist = false;
  // Order
  @Input() order = false;
  @Input() data: any = {};

  @Output() eventOut: EventEmitter<any> = new EventEmitter<any>();
  emitEvent: (value: any) => void;

  readonly tooltip: any = Constants.tooltip;
  readonly CONNECT_STATUS: any = Constants.contactConnectStatus;
  readonly UNCONNECT_STATUS = [1, 4];

  constructor(public contactService: ZContactService,
    private toastsService: ToastsService,
    private commonService: CommonEventService) {

  }

  mergeContacts() {
    this.commonService.broadcast({ channel: 'contact:contact:actions:merge', action: 'open' });
    // this.contactService.mergeDuplicateContacts().then((res: any) => console.log('merge duplicate is DONE'));
  }

  sendRequest(contact: any) {
    this.contactService.sendRequest(contact);
  }

  addToMyContacts(contacts): void {
    this.contactService.addToMyContacts(contacts).then(res => {
      if (res)
        this.toastsService.success('You added others to your contacts successful!');
    });
  }
}
