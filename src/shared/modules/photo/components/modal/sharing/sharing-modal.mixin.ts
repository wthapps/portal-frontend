import { ApiBaseService, CommonEventService } from "@shared/services";
import { ToastsService } from "@shared/shared/components/toast/toast-message.service";
import { SharingModalService } from "./sharing-modal.service";
import { SharingModalResult, SharingEditParams } from "./sharing-modal";

/* This is methods to sharing, to
custom method to overwirte any method in child class */
export class SharingModalMixin {
  selectedObjects: any;

  constructor(public sharingModalService: SharingModalService, public apiBaseService: ApiBaseService, public toastsService: ToastsService, public commonEventService: CommonEventService) { }

  // openModalShare:(input: any) => void;
  openModalShare(array?: any) {
    // this.sharingModalService.open.next();

    this.commonEventService.broadcast({
      channel: 'SharingModalComponent',
      action: 'open'
    })
    let data: any = this.selectedObjects;
    if (array) {
      data = array;
    }
    if (data && data.length == 1 && data[0] && (data[0].model == 'Common::Sharing' || data[0].sharing_id)) {
      let id;
      if (data[0].sharing_id) {
        id = data[0].sharing_id;
      } else {
        id = data[0].id;
      }
      this.apiBaseService.get(`media/sharings/${id}/recipients`).subscribe(res => {
        // this.sharingModalService.open.next({ sharingRecipients: res.data });
        this.commonEventService.broadcast({
          channel: 'SharingModalComponent',
          action: 'update',

        })
      });
      this.sharingModalService.subShareSave = this.sharingModalService.onSave$.subscribe(e => {
        // this.onEditShare(e, id);
      });
    } else {
      this.sharingModalService.subShareSave = this.sharingModalService.onSave$.subscribe(e => {
        // this.onSaveShare(e);
      });
    }
  }

  // Overwrite this in parent class
  // onSaveShare: (input: any) => void;
  onSaveShare(e: SharingModalResult) {
    const data: any = {
      objects: this.selectedObjects.map(s => { return { id: s.id, model: s.model } }),
      recipients: e.users,
      role_id: e.role.id
    };
    this.apiBaseService.post('media/sharings', data).subscribe(res => {
      // this.sharingModalService.update.next(res.data);
    });
  }

  // onEditShare: (e: SharingModalResult, sharing: any) => void;
  onEditShare(e: SharingModalResult, id: any) {
    const data: SharingEditParams = {
      recipients: e.recipients.map(s => { return { id: s.id, role_id: s.role_id, recipient_id: s.user.id, _destroy: s._destroy } }),
      users: e.users,
      id: id
    };
    this.apiBaseService.post('media/sharings/edit_recipients', data).subscribe(res => {
      // this.sharingModalService.update.next(res.data);
    });
  }
}
