import { SharingModalService } from "@shared/shared/components/photo/modal/sharing/sharing-modal.service";
import { SharingCreateParams } from "@shared/shared/components/photo/modal/sharing/sharing-modal";
import { ApiBaseService } from "@shared/services";
import { ToastsService } from "@shared/shared/components/toast/toast-message.service";

/* This is methods to sharing, to
custom method to overwirte any method in child class */
export class SharingModalMixin {
  subShareSave: any;
  selectedObjects: any;

  constructor(public sharingModalService: SharingModalService, public apiBaseService: ApiBaseService, public toastsService: ToastsService) {}

  // openModalShare:(input: any) => void;
  openModalShare(input: any = null) {
    if (this.subShareSave) this.subShareSave.unsubscribe();
    this.sharingModalService.open.next(input);
    this.subShareSave = this.sharingModalService.onSave$.take(1).subscribe(e => {
      this.onSaveShare(e);
    })
  }

  // Overwrite this in parent class
  // onSaveShare: (input: any) => void;
  onSaveShare(e: any) {
    const data: SharingCreateParams = {
      objects: this.selectedObjects.map(s => { return {id: s.id, model: s.model}}),
      recipients: e.sharingRecipients.map(s => { return {role_id: s.role_id, recipient_id: s.user.id}}),
      role_id: e.role.id
    }
    this.apiBaseService.post('media/sharings', data).subscribe(res => {
      this.toastsService.success('You have just create sharing successful');
    });
  }
}
