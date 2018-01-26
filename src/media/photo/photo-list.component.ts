import { Component, ViewChild, OnInit } from '@angular/core';
import { UserService } from '@wth/shared/services';
// import { PhotoSandbox } from './photo.sandbox';
import { ActionTypes } from '../shared/store/actions/photo.action';
import * as appStore from '../shared/store';

import { Store } from '@ngrx/store';

@Component({
  moduleId: module.id,
  selector: 'z-media-photo-list',
  templateUrl: 'photo-list.component.html'
})
export class ZMediaPhotoListComponent implements OnInit {
  @ViewChild('introModal') introModal: any;
  photos: any;// = this.photoSandBox.photo$;

  constructor(
    private userService: UserService,
    // private photoSandBox: PhotoSandbox,
    private store: Store<appStore.State>
  ) {
    // this.photos = this.store.select(appStore.getPhotoEntities);
  }

  ngOnInit() {
    // this.store.dispatch({type: ActionTypes.GET_ALL, payload: null});

    if (!this.userService.getSyncProfile().introduction.media) {
      this.introModal.open();
    }
  }
}
