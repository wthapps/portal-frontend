import { Component, ViewChild, OnInit, Output, EventEmitter } from '@angular/core';
import { PostEditComponent } from './index';
import { UserService } from '../../../core/shared/services/user.service';
import { Observable } from 'rxjs/Observable';
import { Constants } from '../../../core/shared/config/constants';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'post-new',
  templateUrl: 'post-new.component.html'
})

export class PostNewComponent {
  @ViewChild('postAddModal') postAddModal: PostEditComponent;
  @Output() onPostAdded: EventEmitter<any> = new EventEmitter<any>();

  selectedPhotos: Array<any> = new Array<any>();
  uploadPhotos: Array<any> = new Array<any>();
  user$: Observable<any>;

  tooltip:any = Constants.tooltip;

  constructor(public userService: UserService) {
    this.user$ =  this.userService.profile$;
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
