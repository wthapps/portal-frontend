import { SharingModalService } from "@shared/shared/components/photo/modal/sharing/sharing-modal.service";
import { SharingCreateParams, SharingEditParams, SharingModalResult } from "@shared/shared/components/photo/modal/sharing/sharing-modal";
import { ApiBaseService } from "@shared/services";
import { ToastsService } from "@shared/shared/components/toast/toast-message.service";

/* This is methods to sharing, to
custom method to overwirte any method in child class */
export class SharingModalMixin {
  subShareSave: any;
  selectedObjects: any;

  constructor(public sharingModalService: SharingModalService, public apiBaseService: ApiBaseService, public toastsService: ToastsService) {}

  // openModalShare:(input: any) => void;
  openModalShare(array?: any) {
    if (this.subShareSave) this.subShareSave.unsubscribe();
    this.sharingModalService.open.next();
    let data: any = this.selectedObjects;
    if (array) {
      data = array;
    }

    if (data && data.length == 1 && data[0].model == 'Common::Sharing') {
      this.apiBaseService.get(`media/sharings/${data[0].id}/recipients`).subscribe(res => {
        this.sharingModalService.open.next({ sharingRecipients: res.data });
      });
      this.subShareSave = this.sharingModalService.onSave$.subscribe(e => {
        console.log('onEditShare');

        this.onEditShare(e, data[0]);
      });
    } else {
      this.subShareSave = this.sharingModalService.onSave$.subscribe(e => {
        console.log('onSaveShare');

        this.onSaveShare(e);
      });
    }
  }

  // Overwrite this in parent class
  // onSaveShare: (input: any) => void;
  onSaveShare(e: SharingModalResult) {
    const data: any = {
      objects: this.selectedObjects.map(s => { return {id: s.id, model: s.model}}),
      recipients: e.users,
      role_id: e.role.id
    };

    this.apiBaseService.post('media/sharings', data).subscribe(res => {
      this.sharingModalService.update.next(res.data);
    });
  }
  // onEditShare: (e: SharingModalResult, sharing: any) => void;
  onEditShare(e: SharingModalResult, sharing: any) {

    const data: SharingEditParams = {
      recipients: e.recipients.map(s => { return { id: s.id, role_id: s.role_id, recipient_id: s.user.id, _destroy: s._destroy}}),
      users: e.users,
      id: sharing.id
    };
    this.apiBaseService.post('media/sharings/edit_recipients', data).subscribe(res => {
      this.sharingModalService.update.next(res.data);
    });
  }
}
