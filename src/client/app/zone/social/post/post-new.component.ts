import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { ApiBaseService, LoadingService } from '../../../shared/index';
import { PostEditComponent, PostPhotoSelectComponent } from './index';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'post-new',
  templateUrl: 'post-new.component.html'
})

export class PostNewComponent implements OnInit{
  @ViewChild('photoSelectModal') photoModal: PostPhotoSelectComponent;
  @ViewChild('postAddModal') postAddModal: PostEditComponent;

  selectedPhotos: Array<any> = new Array<any>();
  uploadPhotos: Array<any> = new Array<any>();
  files: Array<any> = new Array<any>();

  constructor(private apiService: ApiBaseService, loadingService: LoadingService) {
  }

  ngOnInit(): void {

  }

  open(event: any) {
    this.photoModal.open();
  }
 
  next(photos: any) {
    this.photoModal.close();
    this.selectedPhotos = _.reverse(photos);
    this.postAddModal.photos = this.selectedPhotos;
    this.postAddModal.open();
  }

  close(photos: any) {
    if (photos.length > 0) {
      this.photoModal.open();
    }
  }

  dismiss(photos: any) {
    this.photoModal.close();
    if(photos == null) {
      this.postAddModal.open();
    }
  }

  /**
   *
   * @param event
   */
  addMorePhoto(event: any) {
    this.postAddModal.close();
    this.photoModal.open(true);
  }

  upload(files: any) {
    this.files = files;
    this.photoModal.close();
    this.postAddModal.open();
  }

  post(event: any) {
    console.log('doing posting');
  }

}
