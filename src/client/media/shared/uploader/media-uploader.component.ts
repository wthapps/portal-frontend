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

import { Photo } from '../../../core/shared/models/photo.model';
import { ApiBaseService } from '../../../core/shared/services/apibase.service';
import { PhotoUploadService } from '../../../core/shared/services/photo-upload.service';
import { Subject } from 'rxjs/Subject';
import { ModalDockComponent } from '../../../core/shared/components/modal/dock.component';
import { Router } from '@angular/router';
import { MediaUploaderDataService } from './media-uploader-data.service';

declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'me-uploader',
  templateUrl: 'media-uploader.component.html',
  styleUrls: ['media-uploader.component.css'],
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
              private mediaUploadDataService: MediaUploaderDataService,
              private photoUploadService: PhotoUploadService) {
    this.dragleave();
    // this.events = new Subject();

  //  Listen to summon command from other components
    this.mediaUploadDataService.showUp$.subscribe(() => {
      this.browseFiles(null);
    });

  }

  ngOnInit() {
    this.step = this.uploadSteps.begin;
    this.files = new Array<any>();
  }

  ngAfterViewInit() {
    let _thisPicture = this;
    $('body').bind('dragover', _thisPicture.dragover);

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['files'].currentValue && changes['files'].currentValue.length > 0) {
      this.uploadImages(changes['files'].currentValue);
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

    let pending_files = this.pending_files.slice();
    this.uploadImages(pending_files);
  }


  uploadImages(files: any) {
    this.step = this.uploadSteps.init;
    this.modalDock.open();

    this.uploaded_num = 0;
    this.stopped_num = 0;
    this.files_num = files.length;
    this.photos.length = 0;

    // Convert fileList to array
    this.pending_files = Array.prototype.slice.call( files );
    console.log('Pending files: ', this.pending_files);

    this.photoUploadService.getPhoto(files[0]).take(1).subscribe((res: any) => {
      this.current_photo = res;
    });

    // Stop observable when finish uploading all files
    this.photoUploadService.uploadPhotos(files)
      .takeWhile(() => this.step != this.uploadSteps.uploaded && this.step != this.uploadSteps.stop)
      .subscribe((res: any) => {
          console.log('Upload image to s3 and save info successfully', res);
          this.uploaded_num++;
          let returnData = res.data;
          let originPhoto = res.originPhoto;
          // Remove success photos from pending files
          console.log('Return data: ', res);
          _.remove(this.pending_files, (file: any) => file.name === originPhoto.name && file.type === originPhoto.type);

          this.current_photo = returnData.thumbnail_url;
          this.photos.push(returnData);

          // newPhoto.thumbnail_url = this.current_photo;
          // this.events.next(returnData);
          this.onAction({action: 'updateMediaList', params: { data: returnData}})

          if (this.uploaded_num == this.files_num) {
            this.step = this.uploadSteps.uploaded;
          }
        }
        , (err: any) => {
          this.uploaded_num++;
          // this.step = this.uploadSteps.error;
          console.error('Error when uploading files ', err);
        });
  }

  onAction(options?: any): void {
    // close uploading form
    if ( _.get(options, 'action') !== 'updateMediaList') {
      this.step = this.uploadSteps.closed;
      this.modalDock.close();
      console.log('media-uploader action: ', options);
    }

    // this.outEvent.emit(options);
    this.mediaUploadDataService.onAction(options);
  }

  // onCreateNewAlbum() {
  //   this.createNewAlbum.emit(this.photos);
  // }

  browseFiles(event: any) {
    this.renderer.invokeElementMethod(this.inputFiles.nativeElement, 'click');
  }

  chooseFiles(event: any) {
    this.files = event.target.files;
    if (this.files.length == 0) {
      return;
    }
    this.uploadImages(this.files);
  }

  onDrop(event: any) {
    $('body').removeClass('drag-active');
    event.stopPropagation();
    event.preventDefault();
    this.files = event.dataTransfer.files;
    if (this.files.length == 0) return;
    this.uploadImages(this.files);
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
