import { Component, Input, OnInit, EventEmitter, ViewChild, OnDestroy } from '@angular/core';

import { BsModalComponent } from 'ng2-bs3-modal';
import { CommonEvent, CommonEventService } from '@wth/shared/services';
import { FileUploadHelper } from '@wth/shared/shared/helpers/file/file-upload.helper';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'block-upload-modal',
  templateUrl: 'block-upload-modal.component.html'
})
export class BlockUploadModal implements OnInit, OnDestroy {
  @ViewChild('modal') modal: BsModalComponent;
  file: any;
  fileUploadHelper: any;
  event: any;

  constructor(private commonEventService: CommonEventService) {
    this.fileUploadHelper = new FileUploadHelper();
  }


  ngOnInit() {
    this.event = this.commonEventService.filter(
      (event: CommonEvent) => event.channel == 'chatBlockMessage').subscribe((event: CommonEvent) => {
      this.file = event.payload;
      this.file.extension = this.fileUploadHelper.getExtension(this.file.name);
      this.modal.open();
    });
  }

  ngOnDestroy() {
    this.event.unsubscribe();
  }
}
