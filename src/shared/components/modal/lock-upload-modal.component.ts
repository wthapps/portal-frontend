import { Component, Input, OnInit, EventEmitter, ViewChild, OnDestroy } from '@angular/core';

import { BsModalComponent } from 'ng2-bs3-modal';
import { CommonEvent, CommonEventService } from '@wth/shared/services';
import { FileUtil } from "@shared/shared/utils/file/file.util";

declare var _: any;

@Component({
  selector: 'lock-upload-modal',
  templateUrl: 'lock-upload-modal.component.html'
})
export class LockUploadModalComponent implements OnInit, OnDestroy {
  @ViewChild('modal') modal: BsModalComponent;
  files: any;
  event: any;
  fileUtil: any;
  title: any = "This file type is not permitted for sercurity reasons.";

  constructor(private commonEventService: CommonEventService) {}


  ngOnInit() {
    this.fileUtil = FileUtil;
    this.event = this.commonEventService.filter(
      (event: CommonEvent) => event.channel == 'LockMessage').subscribe((event: CommonEvent) => {
        this.files = event.payload.filter(f => f.allowErrors[0] == event.payload[0].allowErrors[0]);
        this.title = this.files[0].allowTitle || this.title;
        this.modal.open();
    });
  }

  ngOnDestroy() {
    this.event.unsubscribe();
  }
}
