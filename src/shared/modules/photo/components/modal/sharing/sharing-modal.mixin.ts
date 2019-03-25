import { ApiBaseService, CommonEventService } from "@shared/services";
import { ToastsService } from "@shared/shared/components/toast/toast-message.service";
import { SharingModalService } from "./sharing-modal.service";
import { SharingModalResult, SharingEditParams } from "./sharing-modal";
import MediaList from "@shared/modules/photo/models/list-functions/media-list.model";
import Sharing from "@shared/modules/photo/models/sharing.model";
import { MediaType } from "@shared/modules/photo/models/interfaces/media";

/* This is methods to sharing, to
custom method to overwirte any method in child class */
export class SharingModalMixin {
  selectedObjects: any;

  constructor(public sharingModalService: SharingModalService, public apiBaseService: ApiBaseService, public toastsService: ToastsService, public commonEventService: CommonEventService) { }

  // openModalShare:(input: any) => void;
  openModalShare(array: Array<MediaType> = this.selectedObjects) {
    this.commonEventService.broadcast({
      channel: 'SharingModalComponent',
      action: 'open',
      payload: this.selectedObjects,
      onDone: (sharing: Sharing) => {
        this.onSaveShare(sharing);
      }
    });
  }

  // Overwrite this in parent class
  // onSaveShare: (input: any) => void;
  onSaveShare(sharing: Sharing) {
    this.toastsService.success("success");
  }
}
