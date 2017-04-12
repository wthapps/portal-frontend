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

declare var $: any;

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
  pending_request: any;
  photos: Array<Photo> = [];
  files: Array<any>;

  @ViewChild('inputfiles') inputFiles: ElementRef;

  @Output() createNewAlbum: EventEmitter<any> = new EventEmitter<any>();
  @Output() addToAlbum: EventEmitter<any> = new EventEmitter<any>();
  @Output() needToReload: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output() outEvent: EventEmitter<any> = new EventEmitter<any>();


  constructor(private apiService: ApiBaseService, private renderer: Renderer,
              private photoUploadService: PhotoUploadService
  ) {
    this.dragleave();
  }

  ngOnInit() {
    this.step = 0;
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
    if (this.step == 2 || this.step == 4) {
      this.outEvent.emit({
        action: 'addPhoto',
        data: this.photos
      });
    }
    this.step = -1;
  }

  stop(event: any) {
    event.preventDefault();
    if (this.pending_request) {
      this.pending_request.unsubscribe();
    }
    this.stopped_num = this.files_num - this.uploaded_num;
    this.step = 4;
    if (this.uploaded_num > 0) {
      this.needToReload.emit(true);
    }
  }

  uploadImages(files: any) {
    this.step = 1;
    this.uploaded_num = 0;
    this.stopped_num = 0;
    this.files_num = this.files.length;

    this.photoUploadService.getPhoto(files[0]).take(1).subscribe((res: any) => { this.current_photo = res});

    // Stop observable when finish uploading all files
    this.photoUploadService.uploadPhotos(files)
      .takeWhile(() => this.step != 2)
      .subscribe((res: any) => {
        console.log('Upload image to s3 and save info successfully', res);
        this.uploaded_num++;
        if (this.uploaded_num == this.files_num) {
          this.step = 2;
        }
        this.current_photo = res['current_photo'];
        this.photos.push(new Photo(res['data']));
      }
      ,(err: any) => {
        this.step = 3;
        console.error('Error when uploading files ', err);
      });

  }

  onAction(ev: string): void {
    // close uploading form
    this.step = -1;

    this.outEvent.emit({
      action: ev,
      data: this.photos
    });
  }

  onCreateNewAlbum() {
    this.createNewAlbum.emit(this.photos);
  }

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
