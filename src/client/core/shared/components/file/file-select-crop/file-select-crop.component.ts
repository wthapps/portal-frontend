import { Component, ViewChild, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/takeUntil';

import { PhotoModalDataService } from '../../../services/photo-modal-data.service';
import { FileSelectListComponent } from '../file-select-list/file-select-list.component';
import { UploadCropImageComponent } from '../../upload-crop-image/upload-crop-image.component';
import { CommonEventService } from '../../../services/common-event/common-event.service';
import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { PhotoUploadService } from '../../../services/photo-upload.service';
import { Subject } from 'rxjs/Subject';


declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'h-file-select-crop',
  templateUrl: 'file-select-crop.component.html'
})

export class FileSelectCropComponent implements OnInit, OnDestroy {
  @ViewChild('cropImage') cropImage: UploadCropImageComponent;
  // @Input() selectedItems: Array<any>;
  // @Output() onUpload: EventEmitter<any> = new EventEmitter<any>();
  @Output() event: EventEmitter<any> = new EventEmitter<any>();

  // action: string = 'Done';

  // postPhotos: Array<any> = new Array<any>();
  // uploadPhotos: Array<any> = new Array<any>();
  // hasBack: boolean = false;
  // files: Array<any> = new Array<any>();
  // editCurrentMode: boolean = false;
  currentImage: string;

  close$: Observable<any>;
  destroySubject: Subject<any> = new Subject<any>();
  // commonSubscription: Subscription;

  constructor(private commonEventService: CommonEventService,
              private photoSelectDataService : PhotoModalDataService,
              private photoUploadService: PhotoUploadService) {
  }

  doAction(options: any) {
    this.event.emit(options);
  }

  ngOnInit(): void {
    this.close$ = this.photoSelectDataService.closeObs$.merge(this.photoSelectDataService.openObs$, this.photoSelectDataService.dismissObs$, this.destroySubject);

    this.commonEventService.filter((event: any) => event.channel == 'SELECT_CROP_EVENT')
      .takeUntil(this.destroySubject)
      .subscribe((event: any) => {
      this.doEvent(event);
    });
  }

  doEvent(event: any) {
    // console.log(event);
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



  private subscribePhotoSelectEvents() {

    this.photoSelectDataService.nextObs$.takeUntil(this.close$).subscribe((photos : any) => {
      this.next(photos);
    });

    this.photoSelectDataService.uploadObs$.takeUntil(this.close$).subscribe((files: any) => {
      this.handleLocalImage(files);
    });
  }

  ngOnDestroy() {
    this.destroySubject.next();
    this.destroySubject.unsubscribe();
    // this.unsubscribeAll([this.commonSubscription]);
  }

  editCurrentImage() {
    console.debug('inside file-select-crop - editCurrentImage handling ...', this.currentImage);
    this.cropImage.open(this.currentImage);
    this.photoSelectDataService.close();
  }

  next(files: any[]) {
    if(files.length < 1) {
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
    if(files.length < 1) {
      console.error('file-select-crop: handleLocalImage error: files should have at least 1 element');
    } else {
      this.photoUploadService.getPhoto(files[0])
        .then((image: any) => {
          this.cropImage.open(image);
          this.photoSelectDataService.close();
        });
    }
  }

  // onImageClicked(img: any): void {
  //   console.debug('inside onImageClicked: ', img);
  //   // this.photoDataService.upload([img]);
  // }

  onChangeImage() {]
    this.openPhotoSelect();
  }

  onDone(image: string) {
    this.dispatchEvent({action: 'SELECT_CROP:DONE', payload: image});
  }

  // private unsubscribeAll(subs: Array<Subscription>) {
  //   _.each(subs, (s: Subscription) => {
  //     if (s) s.unsubscribe();
  //   });
  // }

}

