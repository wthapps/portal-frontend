import { Component, Input, OnInit, EventEmitter, ViewChild, OnDestroy } from '@angular/core';

import { BsModalComponent } from 'ng2-bs3-modal';
import { CommonEvent, CommonEventService } from '@wth/shared/services';
import { FileUtil } from "@shared/shared/utils/file/file.util";

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'lock-upload-modal',
  templateUrl: 'lock-upload-modal.component.html'
})
export class LockUploadModal implements OnInit, OnDestroy {
  @ViewChild('modal') modal: BsModalComponent;
  files: any;
  event: any;
  fileUtil: any;

  constructor(private commonEventService: CommonEventService) {}


  ngOnInit() {
    this.fileUtil = FileUtil;
    this.event = this.commonEventService.filter(
      (event: CommonEvent) => event.channel == 'chatLockMessage').subscribe((event: CommonEvent) => {
      this.files = event.payload;
      this.modal.open();
    });
  }

  ngOnDestroy() {
    this.event.unsubscribe();
  }
}
