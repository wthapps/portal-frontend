import {
  Component,
  Output,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs';

import { WUploader } from './../../../../shared/services/w-uploader';
import { ModalDockComponent } from '@shared/shared/components/modal/dock.component';
import { ApiBaseService, CommonEventService, CommonEventHandler } from '@shared/services';
import { ToastsService } from '@shared/shared/components/toast/toast-message.service';
import { ModalService } from '@shared/components/modal/modal-service';
import { Constants } from '@shared/constant';
import { FileUploadService } from '@shared/services/file-upload.service';
import DriveFile from '@shared/modules/drive/models/drive-file.model';
import DriveFileList from '@shared/modules/drive/models/functions/drive-file-list';


declare var $: any;
declare var _: any;

interface CustomFile {
  name: string;
  type: string;
  file_type: 'file' | 'photo' | 'video';
  status: number;
}

@Component({
  selector: 'drive-upload-dock',
  templateUrl: 'drive-upload-dock.component.html',
  styleUrls: ['drive-upload-dock.component.scss'],
})
export class DriveUploadDockComponent implements OnInit {
  @ViewChild('modalDock') modalDock: ModalDockComponent;
  readonly icon_hash = {
    photo: 'fa fa-picture-o',
    video: 'fa fa-video-camera',
    file: 'fa fa-file',
    error: 'fa fa-exclamation-triangle text-danger',
    loading: 'fa fa-spinner fa-spin'
  };
  collapse: boolean = false;
  tooltip: any = Constants.tooltip;
  files: Array<DriveFile> = [];
  readonly upload_steps: any = {
    closed: -1,
    begin: 0,
    init: 1,
    uploaded: 2,
    error: 3,
    stop: 4,
  };

  constructor(
    public apiBaseService: ApiBaseService,
    public toastsService: ToastsService,
    public fileUploadService: FileUploadService,
    public commonEventService: CommonEventService,
  ) {
  }

  ngOnInit() {
    this.fileUploadService.onStart.subscribe(res => {
      this.files = DriveFileList.map(res).map((item: DriveFile) => {
        this.modalDock.open();
        item.setMetadata({ percent: 0, status: this.upload_steps.init })
        return item;
      });
    });
    // this.fileUploadService.onProgress.subscribe(res => {
    //   console.log(res);
    // });
    this.fileUploadService.onDone.subscribe(res => {
      this.files = this.files.map((item: DriveFile) => {
        item.setMetadata({ percent: 100, status: this.upload_steps.uploaded })
        return item;
      });
    });
  }

  cancel(file) {

  }

  close(event: any) {
    this.modalDock.close();
  }
}
