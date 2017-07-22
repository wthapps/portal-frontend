import { Component, OnInit, Input } from '@angular/core';
import { ZContactService } from '../../services/contact.service';
import { ConfirmationService } from 'primeng/components/common/api';
import { CommonEventService } from '../../../../core/shared/services/common-event/common-event.service';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-contact-shared-three-dot-actions',
  templateUrl: 'three-dot-actions.component.html'
})
export class ZContactSharedThreeDotActionComponent {
  @Input() data: any;

  constructor(private commonEventService: CommonEventService,
              private contactService: ZContactService
  ) {

  }

  deleteContact(data: any) {
    this.contactService.confirmDeleteContact(data);
  }

  doEvent(event: any) {
    this.commonEventService.broadcast(event);
  }
}
