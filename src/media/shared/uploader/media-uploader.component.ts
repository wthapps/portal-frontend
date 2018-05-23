import {
  Component,
  Output,
  OnInit,
  AfterViewInit,
  OnChanges,
  EventEmitter,
  SimpleChanges,
  ViewChild,
  ElementRef,
  Renderer
} from '@angular/core';
import { Router } from '@angular/router';


import 'rxjs/add/operator/takeWhile';

import { MediaUploaderDataService } from './media-uploader-data.service';
import { ModalDockComponent } from '@wth/shared/shared/components/modal/dock.component';
import { ApiBaseService, PhotoUploadService } from '@wth/shared/services';
import { FileUploadPolicy } from "@shared/policies/file-upload.policy";
import { CommonEventService } from "@shared/services/common-event/common-event.service";

declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'me-uploader',
  templateUrl: 'media-uploader.component.html',
  styleUrls: ['media-uploader.component.scss'],
})
export class MediaUploaderComponent implements OnInit, OnChanges, AfterViewInit {
  current_photo: any;
  step: number;
  files_num: number;
  uploaded_num: number;
  stopped_num: number;
  pending_files: any;
  pending_request: any;
  photos: Array<any> = [];
  files: Array<any>;
  readonly uploadSteps: any = {
    closed: -1,
    begin: 0,
    init: 1,
    uploaded: 2,
    error: 3,
    stop: 4,
  };
  // events: Subject<any>;

  @ViewChild('inputfiles') inputFiles: ElementRef;

  @Output() createNewAlbum: EventEmitter<any> = new EventEmitter<any>();
  @Output() addToAlbum: EventEmitter<any> = new EventEmitter<any>();
  @Output() needToReload: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output() outEvent: EventEmitter<any> = new EventEmitter<any>();


  @ViewChild('modalDock') modalDock: ModalDockComponent;

  constructor(private apiService: ApiBaseService, private renderer: Renderer,
              private router: Router,
              private apiBaseService: ApiBaseService,
              private commonEventService: CommonEventService,
              private mediaUploadDataService: MediaUploaderDataService,
              private photoUploadService: PhotoUploadService) {
    this.dragleave();
  }

  ngOnInit() {
    this.step = this.uploadSteps.begin;
    this.files = new Array<any>();
    this.commonEventService.filter(e => e.channel == 'MediaUploadDocker').subscribe((e: any) => {
      if (e.action == 'init') {
        this.step = this.uploadSteps.init;
        this.modalDock.open();

        this.uploaded_num = 0;
        this.stopped_num = 0;
        this.files_num = e.payload.length;
        this.photos.length = 0;

        // Convert fileList to array
        this.pending_files = e.payload;

        this.current_photo = e.payload[0].result;
      };
      if (e.action == 'uploaded') {
        this.uploaded_num++;
        const returnData = e.payload.data;
        const originPhoto = e.payload.originPhoto;
        this.current_photo = returnData.thumbnail_url;
        this.photos.push(returnData);

        // Remove success photos from pending files
        _.remove(this.pending_files, (file: any) => file.name === originPhoto.name && file.type === originPhoto.type);

        this.onAction({ action: 'updateMediaList', payload: { data: returnData } });

        if (this.uploaded_num == this.files_num) {
          this.step = this.uploadSteps.uploaded;
        }
      }
    })
  }

  ngAfterViewInit() {
    let _thisPicture = this;
    $('body').bind('dragover', _thisPicture.dragover);

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['files'].currentValue && changes['files'].currentValue.length > 0) {
      this.files_num = this.files.length;
      this.photos = [];
    }
  }

  close() {
    if (this.step == this.uploadSteps.uploaded || this.step == this.uploadSteps.stop) {
      this.outEvent.emit({
        action: 'addPhoto',
        data: this.photos
      });
    }
    this.step = this.uploadSteps.closed;
  }

  stop(event: any) {
    event.preventDefault();
    if (this.pending_request) {
      this.pending_request.unsubscribe();
    }
    this.stopped_num = this.files_num - this.uploaded_num;
    this.step = this.uploadSteps.stop;
    if (this.uploaded_num > 0) {
      this.needToReload.emit(true);
    }
  }

  // Retry upload pending files
  retryUpload(event: any) {
    event.preventDefault();
    this.commonEventService.broadcast({ channel: 'MediaUploadDocker', action: 'init', payload: this.pending_files });
    this.pending_files.forEach(f => {
      this.apiBaseService.post(`media/photos`, f).subscribe(res => {
        this.commonEventService.broadcast({ channel: 'MediaUploadDocker', action: 'uploaded', payload: { data: res.data, originPhoto: f } });
      });
    });
  }

  onAction(options?: any): void {
    // close uploading form
    if ( _.get(options, 'action') !== 'updateMediaList') {
      this.step = this.uploadSteps.closed;
      this.modalDock.close();
    }

    // this.outEvent.emit(options);
    this.mediaUploadDataService.onAction(options);
  }

  // onCreateNewAlbum() {
  //   this.createNewAlbum.emit(this.photos);
  // }

  onDrop(event: any) {
    // Code does not work
    // $('body').removeClass('drag-active');
    // event.stopPropagation();
    // event.preventDefault();
    // this.files = event.dataTransfer.files;
    // if (this.files.length == 0) return;
    // this.uploadImages(this.files);
  }

  dragleave() {
    $('body').removeClass('drag-active');
  }

  dragover(event: any) {
    $('body').addClass('drag-active');
    event.preventDefault();
  }

  dragenter() {
    $('body').addClass('drag-active');
  }

}
