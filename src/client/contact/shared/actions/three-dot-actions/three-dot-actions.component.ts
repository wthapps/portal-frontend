import { Component, OnInit, Input } from '@angular/core';
import { ZContactService } from '../../services/contact.service';
import { ConfirmationService } from 'primeng/components/common/api';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-contact-shared-three-dot-actions',
  templateUrl: 'three-dot-actions.component.html'
})
export class ZContactSharedThreeDotActionComponent {
  @Input() data: any;

  constructor(private contactService: ZContactService, private confirmationService: ConfirmationService) {

  }

  deleteContact() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this contact ?',
      header: 'Delete Contact',
      accept: () => {
        this.contactService.deleteContact(this.data).subscribe((res: any) => {
          this.contactService.contactThreeDotActionsService.sendOut({action: "deleted"});
        });
      }
    });
  }
}
