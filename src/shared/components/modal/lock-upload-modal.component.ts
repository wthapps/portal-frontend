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
  text: any = "This file type is not permitted for sercurity reasons.";
  title: any = "File can\'t be uploaded";
  extension: any;
  icons: any = {
    file: "fa fa-file-archive-o",
    video: "fa fa-video-camera"
  }

  constructor(private commonEventService: CommonEventService) {}


  ngOnInit() {
    this.fileUtil = FileUtil;
    this.event = this.commonEventService.filter(
      (event: CommonEvent) => event.channel === 'LockMessage').subscribe((event: CommonEvent) => {
        this.files = event.payload.filter(f => f.validateErrors[0] === event.payload[0].validateErrors[0]);
        this.text = this.files[0].validateText || this.text;
        this.title = this.files[0].validateTitle || this.title;
        this.files = this.files.map(f => {
          f.extension = FileUtil.getExtension(f);
          f.icon = this.icons.file;
          if (f.type.match(/video/g)) {
            f.icon = this.icons.video;
          }
          return f;
        });
        this.modal.open();
    });
  }

  ngOnDestroy() {
    this.event.unsubscribe();
  }
}
