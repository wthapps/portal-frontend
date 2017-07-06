import { Component, OnInit, Input } from '@angular/core';
import { ZContactService } from '../services/contact.service';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-contact-shared-three-dot-actions',
  templateUrl: 'three-dot-actions.component.html'
})
export class ZContactSharedThreeDotActionComponent {
  @Input() data: any;

  constructor(private contactService: ZContactService) {

  }

  deleteContact() {
    this.contactService.deleteContact(this.data).subscribe((res: any) => {
      this.contactService.contactThreeDotActionsService.sendOut({action: "deleted"});
    })
  }
}
