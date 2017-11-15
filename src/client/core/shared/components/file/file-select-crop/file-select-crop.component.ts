import { Component, ViewChild, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/takeUntil';

import { PhotoModalDataService } from '../../../services/photo-modal-data.service';
import { UploadCropImageComponent } from '../../upload-crop-image/upload-crop-image.component';
import { CommonEventService } from '../../../services/common-event/common-event.service';
import { PhotoUploadService } from '../../../services/photo-upload.service';
import { Subject } from 'rxjs/Subject';


declare let $: any;
declare let _: any;

@Component({
  moduleId: module.id,
  selector: 'h-file-select-crop',
  templateUrl: 'file-select-crop.component.html'
})

export class FileSelectCropComponent implements OnInit, OnDestroy {
  @ViewChild('cropImage') cropImage: UploadCropImageComponent;
  @Output() event: EventEmitter<any> = new EventEmitter<any>();

  currentImage: string;

  close$: Observable<any>;
  destroySubject: Subject<any> = new Subject<any>();

  constructor(private commonEventService: CommonEventService,
              private photoSelectDataService: PhotoModalDataService,
              private photoUploadService: PhotoUploadService) {
  }


  ngOnInit(): void {
    this.close$ = this.photoSelectDataService.closeObs$.merge(this.photoSelectDataService.openObs$, this.photoSelectDataService.dismissObs$, this.destroySubject);

    this.commonEventService.filter((event: any) => event.channel == 'SELECT_CROP_EVENT')
      .takeUntil(this.destroySubject)
      .subscribe((event: any) => {
        this.doEvent(event);
      });
  }


  ngOnDestroy() {
    this.destroySubject.next();
    this.destroySubject.unsubscribe();
    // this.unsubscribeAll([this.commonSubscription]);
  }

  doAction(options: any) {
    this.event.emit(options);
  }


  doEvent(event: any) {
    console.debug('inside file-select-crop doEvent: ', event);
    switch (event.action) {
      case 'SELECT_CROP:OPEN':
        console.debug('inside doEvent - SELECT_CROP:OPEN', event);
        this.currentImage = event.payload;
        this.openPhotoSelect();
        break;
      case 'SELECT_CROP:EDIT_CURRENT':
        console.debug('inside doEvent - SELECT_CROP:EDIT_CURRENT', event);
        this.editCurrentImage();
        break;
      default:
        break;
    }
  }

  dispatchEvent(event: any) {
    this.commonEventService.broadcast({...event, channel: 'SELECT_CROP_EVENT'});
  }

  openPhotoSelect() {
    this.photoSelectDataService.open({editCurrentMode: true});
    this.subscribePhotoSelectEvents();
  }

  editCurrentImage() {
    console.debug('inside file-select-crop - editCurrentImage handling ...', this.currentImage);
    this.cropImage.open(this.currentImage);
    this.photoSelectDataService.close();
  }

  next(files: any[]) {
    if (files.length < 1) {
      console.error('file-select-crop: next error: files should have at least 1 element');
    } else {
      console.debug('inside file-select-crop - next handling ...', files);
      let img: string = files[0].thumbnail_url;
      this.cropImage.open(img);
      this.photoSelectDataService.close();
    }
  }

  handleLocalImage(files: any[]) {
    console.debug('inside file-select-crop - handleLocalImage handling ...', files);
    if (files.length < 1) {
      console.error('file-select-crop: handleLocalImage error: files should have at least 1 element');
    } else {
      this.photoUploadService.getPhoto(files[0])
        .then((image: any) => {
          this.cropImage.open(image);
          this.photoSelectDataService.close();
        });
    }
  }

  onChangeImage() {
    this.openPhotoSelect();
  }

  onDone(image: string) {
    this.dispatchEvent({action: 'SELECT_CROP:DONE', payload: image});
  }


  private subscribePhotoSelectEvents() {

    this.photoSelectDataService.nextObs$.takeUntil(this.close$).subscribe((photos: any) => {
      this.next(photos);
    });

    this.photoSelectDataService.uploadObs$.takeUntil(this.close$).subscribe((files: any) => {
      this.handleLocalImage(files);
    });
  }

}

