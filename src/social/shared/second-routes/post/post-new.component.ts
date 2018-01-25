import { Component, ViewChild, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { UserService } from '@wth/shared/services';
import { Constants } from '@wth/shared/constant';
import { PostEditComponent } from './post-edit.component';

@Component({
  selector: 'post-new',
  templateUrl: 'post-new.component.html'
})

export class PostNewComponent {
  @ViewChild('postAddModal') postAddModal: PostEditComponent;

  selectedPhotos: Array<any> = new Array<any>();
  user$: Observable<any>;

  tooltip:any = Constants.tooltip;

  constructor(public userService: UserService) {
    this.user$ =  this.userService.getAsyncProfile();
  }

  open(event: any, choosePhotos?: boolean) {
    if (choosePhotos == true) {
      return;
    }
    this.postAddModal.open();
  }

  next(photos: any) {
    this.selectedPhotos = _.reverse(photos);
    this.postAddModal.open({post: {photos: this.selectedPhotos}});
  }

  close(photos: any) {
    if (photos.length > 0) {
    }
  }

  post(event: any) {
    console.log('doing posting');
  }

}
