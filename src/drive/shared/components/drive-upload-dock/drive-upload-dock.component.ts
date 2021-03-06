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
import { ApiBaseService, CommonEventService, CommonEventHandler, WthConfirmService } from '@shared/services';
import { ToastsService } from '@shared/shared/components/toast/toast-message.service';
import { ModalService } from '@shared/components/modal/modal-service';
import { Constants } from '@shared/constant';
import { FileDriveUploadService } from '@shared/services/file-drive-upload.service';
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
  collapse = false;
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
    public fileDriveUploadService: FileDriveUploadService,
    public wthConfirmService: WthConfirmService,
    public commonEventService: CommonEventService,
  ) {
  }

  ngOnInit() {
    this.fileDriveUploadService.onStart.subscribe(res => {
      this.modalDock.open('media-uploader-dock');

      const newFiles = DriveFileList.map(res).map((item: DriveFile) => {
        item.setMetadata({ percent: 0, status: this.upload_steps.begin });
        return item;
      });
      this.files = this.files.filter(f => f._metadata.status === this.upload_steps.init).concat(newFiles);
    });
    this.fileDriveUploadService.onProgress.subscribe(res => {
      this.files = this.files.map((item: DriveFile) => {
        if (item.id === res.id) {
          item = new DriveFile({ ...res, ...item });
          item.setMetadata({ percent: 0, status: this.upload_steps.init, cancelable: true });
        }
        return item;
      });
    });
    this.fileDriveUploadService.onDone.subscribe(res => {
      this.files = this.files.map((item: DriveFile) => {
        if (item.file_upload_id === res.file_upload_id) {
          item.setMetadata({ percent: 100, status: this.upload_steps.uploaded });
        }
        return item;
      });
    });
    this.fileDriveUploadService.onError.subscribe(res => {
      this.files = this.files.map((item: DriveFile) => {
        if (item.file_upload_id === res.file_upload_id) {
          item.setMetadata({ percent: 0, status: this.upload_steps.error });
        }
        return item;
      });
    });
  }

  cancel(file) {
    this.fileDriveUploadService.abortMultipartUploadS3(file);
  }

  retry(file) {
    this.fileDriveUploadService.retry(file, {});
  }

  close(event: any) {
    const cancelableFiles = this.files.filter(f => {
      return f._metadata.cancelable && f._metadata.status === this.upload_steps.init;
    });

    if (cancelableFiles.length > 0) {
      this.wthConfirmService.confirm({
        acceptLabel: 'Cancel uploads',
        rejectLabel: 'Continue uploads',
        message: 'Your uploads aren\'t complete. Do you want to cancel all ongoing uploads?',
        header: 'Cancel uploads',
        accept: () => {
          this.modalDock.close();
          cancelableFiles.forEach(f => {
            this.fileDriveUploadService.abortMultipartUploadS3(f);
          });
        }
      });
    } else {
      this.modalDock.close();
    }
  }
}
