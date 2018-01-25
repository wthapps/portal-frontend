import { Component, ViewChild, OnInit } from '@angular/core';
import { UserService } from '@wth/shared/services';
// import { PhotoSandbox } from './photo.sandbox';
import * as fromPhoto from '../shared/store';
import { Store } from '@ngrx/store';
''

@Component({
  moduleId: module.id,
  selector: 'z-media-photo-list',
  templateUrl: 'photo-list.component.html'
})
export class ZMediaPhotoListComponent implements OnInit {
  @ViewChild('introModal') introModal: any;
  photos:any;// = this.photoSandBox.photo$;

  constructor(
    private userService: UserService,
    // private photoSandBox: PhotoSandbox,
    private store: Store<fromPhoto.State>
  ) {

  }

  ngOnInit() {
    this.photos = this.store.select(fromPhoto.getPhotos);
    if (!this.userService.getSyncProfile().introduction.media) this.introModal.open();
  }
}
