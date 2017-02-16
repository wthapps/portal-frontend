import { Component, ViewChild, OnInit, Output, EventEmitter } from '@angular/core';
// import { ApiBaseService, LoadingService } from '../../../shared/index';
import { PostEditComponent } from './index';
import { ApiBaseService } from '../../../core/shared/services/apibase.service';
import { LoadingService } from '../../../core/partials/loading/loading.service';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'post-new',
  templateUrl: 'post-new.component.html'
})

export class PostNewComponent implements OnInit {
  // @ViewChild('photoSelectModal') photoModal: PostPhotoSelectComponent;
  @ViewChild('postAddModal') postAddModal: PostEditComponent;
  @Output() onPostAdded: EventEmitter<any> = new EventEmitter<any>();

  selectedPhotos: Array<any> = new Array<any>();
  uploadPhotos: Array<any> = new Array<any>();
  // files: Array<any> = new Array<any>();

  constructor(private apiService: ApiBaseService, loadingService: LoadingService) {
  }

  ngOnInit(): void {

  }

  open(event: any, choosePhotos?: boolean) {
    if (choosePhotos == true) {
      // this.photoModal.open();
      return;
    }
    this.postAddModal.open();
  }

  next(photos: any) {
    // this.photoModal.close();
    this.selectedPhotos = _.reverse(photos);
    this.postAddModal.open({post: {photos: this.selectedPhotos}});
  }

  close(photos: any) {
    if (photos.length > 0) {
      // this.photoModal.open();
    }
  }

  addedPost(post: any) {
    this.onPostAdded.emit(post);
  }

  post(event: any) {
    console.log('doing posting');
  }

}
