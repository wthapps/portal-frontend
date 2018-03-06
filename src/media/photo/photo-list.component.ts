import { Component, ViewChild, OnInit } from '@angular/core';
import { UserService } from '@wth/shared/services';
// import { PhotoSandbox } from './photo.sandbox';
import { ActionTypes } from '../shared/store/photo/photo.action';
import * as appStore from '../shared/store';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

@Component({
  moduleId: module.id,
  selector: 'z-media-photo-list',
  templateUrl: 'photo-list.component.html'
})
export class ZMediaPhotoListComponent implements OnInit {
  photos: Observable<Array<any>>;// = this.photoSandBox.photo$;

  constructor(
    private userService: UserService,
    // private photoSandBox: PhotoSandbox,
    private store: Store<appStore.State>
  ) {
    this.photos = this.store.select(appStore.getPhotos);
  }

  ngOnInit() {
    this.store.dispatch({type: ActionTypes.GET_ALL, payload: null});
  }
}
