import { Component, ViewChild, OnInit, Output, EventEmitter, OnDestroy, Input } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/observable/merge';

import { PhotoModalDataService } from '../../../../services/photo-modal-data.service';
import { UploadCropImageComponent } from '../../upload-crop-image/upload-crop-image.component';
import { CommonEventService } from '../../../../services/common-event/common-event.service';
import { PhotoUploadService } from '../../../../services/photo-upload.service';
import { Subject } from 'rxjs/Subject';
import { CropImageComponent } from '@wth/shared/shared/components/file/file-crop/crop-image.component';
import { WMediaSelectionService } from '@wth/shared/components/w-media-selection/w-media-selection.service';
import { takeUntil, map } from 'rxjs/operators';
import { componentDestroyed } from 'ng2-rx-componentdestroyed';


declare let $: any;
declare let _: any;

@Component({
  selector: 'h-file-select-crop',
  templateUrl: 'file-select-crop.component.html'
})

export class FileSelectCropComponent implements OnInit, OnDestroy {
  @ViewChild('cropImage') cropImage: CropImageComponent;
  @Input() useNewPhotoSelect: boolean = false;
  @Output() event: EventEmitter<any> = new EventEmitter<any>();

  currentImage: string;

  close$: Observable<any>;
  destroySubject: Subject<any> = new Subject<any>();

  constructor(private commonEventService: CommonEventService,
              private photoSelectDataService: PhotoModalDataService,
              private mediaSelectionService: WMediaSelectionService,
              private photoUploadService: PhotoUploadService) {
  }


  ngOnInit(): void {
    this.close$ = Observable.merge(this.photoSelectDataService.closeObs$, this.photoSelectDataService.openObs$, this.photoSelectDataService.dismissObs$, this.destroySubject);

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
    switch (event.action) {
      case 'SELECT_CROP:OPEN':
        this.currentImage = event.payload.currentImage;
        let edit: any = true;
        if(event.payload.editCurrentMode == false) edit = event.payload.editCurrentMode;
        this.openPhotoSelect(edit);
        break;
      case 'SELECT_CROP:EDIT_CURRENT':
        this.editCurrentImage();
        break;
      default:
        break;
    }
  }

  dispatchEvent(event: any) {
    this.commonEventService.broadcast({...event, channel: 'SELECT_CROP_EVENT'});
  }

  openPhotoSelect(editCurrentMode: any) {
    if(!this.useNewPhotoSelect) {
      this.photoSelectDataService.open({editCurrentMode: editCurrentMode});
      this.subscribePhotoSelectEvents();
    }
    else {
      this.mediaSelectionService.setMultipleSelection(true);
      this.mediaSelectionService.open();

      let close$: Observable<any> = Observable.merge(this.mediaSelectionService.open$, componentDestroyed(this));
      this.mediaSelectionService.selectedMedias$.pipe(
        takeUntil(close$)
      ).subscribe((items) => {
        this.next(items);
      });

      this.mediaSelectionService.uploadingMedias$.pipe(
        takeUntil(close$),
        map(([file, dataUrl]) => [file])
      ).subscribe((files: any) => {
        this.handleLocalImage(files);
      });
    }
  }

  editCurrentImage() {
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
    if (files.length < 1) {
      console.error('file-select-crop: handleLocalImage error: files should have at least 1 element');
    } else {
      console.debug('handle local image: ', files);
      this.photoUploadService.getPhoto(files[0])
        .then((image: any) => {
          console.debug('image: ', image);
          this.cropImage.open(image);
          this.photoSelectDataService.close();
        });
    }
  }

  onChangeImage() {
    this.openPhotoSelect(true);
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
