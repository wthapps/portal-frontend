import {
  Component,
  Output,
  OnInit,
  AfterViewInit,
  OnChanges,
  EventEmitter,
  SimpleChanges,
  ViewChild,
  ElementRef, OnDestroy
} from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs';

import { MediaUploaderDataService } from './../media-uploader-data.service';
import { WUploader } from './../../../../shared/services/w-uploader';
import { ModalDockComponent } from '@shared/shared/components/modal/dock.component';
import { ApiBaseService, CommonEventService } from '@shared/services';
import { ToastsService } from '@shared/shared/components/toast/toast-message.service';
import { ModalService } from '@shared/components/modal/modal-service';
import { Constants } from '@shared/constant';


declare var $: any;
declare var _: any;

interface CustomFile {
  name: string;
  type: string;
  file_type: 'file' | 'photo' | 'video';
  status: number;
}

@Component({
  selector: 'me-uploader-v1',
  templateUrl: 'media-uploader-v1.component.html',
  styleUrls: ['media-uploader-v1.component.scss'],
})
export class MediaUploaderV1Component implements OnInit, AfterViewInit, OnDestroy {
  files_num: number;
  uploaded_num = 0;
  uploading_num = 0;
  files: Array<any>;
  upload_hash: {[fileId: string]: CustomFile} = {};
  upload_arr: Array<any> = [];
  readonly upload_steps: any = {
    closed: -1,
    begin: 0,
    init: 1,
    uploaded: 2,
    error: 3,
    stop: 4,
  };
  // events: Subject<any>;
  readonly icon_hash = {
    photo: 'fa fa-picture-o',
    video: 'fa fa-video-camera',
    file: 'fa fa-file',
    error: 'fa fa-exclamation-triangle text-danger',
    loading: 'fa fa-spinner fa-spin'
  };

  current_file: any;
  current_progress: any;
  destroy$ = new Subject();
  readonly tooltip: any = Constants.tooltip;

  @Output() outEvent: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('modalDock') modalDock: ModalDockComponent;
  private uploader_sub: Subscription;

  constructor(public apiBaseService: ApiBaseService,
              private mediaUploadDataService: MediaUploaderDataService,
              public toastsService: ToastsService,
              public router: Router,
              private uploader: WUploader,
              private modalService: ModalService) {
  }

  ngOnInit() {
    console.log('media uploader v1 on init');
    this.clearItems();

    this.uploader_sub = this.uploader.event$.subscribe(event => {
      this.updateUploadStatus(event);
    });
  }

  ngOnDestroy() {
    this.uploader_sub.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterViewInit() {
  }

  retry(file) {
    const {id, name} = file;
    Object.assign(this.upload_hash[id], {status: this.upload_steps.init});
    this.uploader.retryUpload(id);
  }

  cancel(file) {
    const {name, id} = file;
    Object.assign(this.upload_hash[id], {status: this.upload_steps.error});
    this.uploader.cancel(file);
  }

  updateUploadStatus(event) {
    switch (event.action) {
      case 'file-added': {
        // Show uploading files
        const { file} = event.payload;
        const file_type = this.whichType(file.type);
        if (!this.upload_hash[file.id]) {
          this.upload_arr.push(file);
        }
        this.upload_hash[file.id] = {...file, file_type, status: this.upload_steps.begin};
        this.modalDock.open('media-uploader-dock');
      }
        break;
      case 'progress': {
        const {file} = event.payload;
        this.upload_hash[file.id].status = this.upload_steps.init;

        this.uploadingCount();
      }
        break;
      case 'success': {
        const {file} = event.payload;
        this.upload_hash[file.id].status = this.upload_steps.uploaded;

        this.uploadingCount();
        this.uploaded_num += 1;
      }
        break;
      case 'error': {
        const {file} = event.payload;
        this.upload_hash[file.id].status = this.upload_steps.error;
        this.uploadingCount();
      }
        break;
      case 'cancel-success':
      case 'complete': {}
        break;
    }
  }

  clearItems() {
    this.upload_hash = {};
    this.upload_arr.length = 0;
    this.uploaded_num = 0;
    this.uploading_num = 0;
    this.uploader.cancelAll(true);
  }

  private whichType(object_type: string) {
    if (object_type.startsWith('image')) {
      return 'photo';
    }
    if (object_type.startsWith('video')) {
      return 'video';
    }
    return 'file';
  }

  private uploadingCount() {
    this.uploading_num = Object.values(this.upload_hash).filter(o => o.status === this.upload_steps.init).length;
  }
}
