import { ApiBaseService, WthConfirmService } from '@shared/services';
import { ViewChild, ViewContainerRef } from '@angular/core';
/* MediaListDetailMixin for album detail, playlist detaill*/
export class MediaListDetailMixin {
  object: any;
  showDetailsInfo: any;

  loadObject(input?: any) {
    throw new Error('Should be overwrite');
  }

  toggleInfo() {
    this.showDetailsInfo = !this.showDetailsInfo;
  }
}
