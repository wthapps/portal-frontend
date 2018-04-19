import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Constants } from '@wth/shared/constant';
import { MediaUploaderDataService } from '@media/shared/uploader/media-uploader-data.service';
import * as appStore from '../shared/store';
import { Store } from '@ngrx/store';
import {
  GetAll,
  Favorite,
  AddSuccess,
  DeleteMany
} from '../shared/store/media/media.actions';
import { MediaActionHandler } from '@media/shared/media';

@Component({
  moduleId: module.id,
  selector: 'me-shared-with-me',
  templateUrl: 'shared-with-me.component.html'
})
export class ZMediaSharedWithMeComponent extends MediaActionHandler implements OnInit {
  objects$: Observable<any>;
  loading$: Observable<any>;
  nextLink$: Observable<any>;
  tooltip: any = Constants.tooltip;

  private path = 'media/sharings/shared_with_me';

  constructor(
    protected store: Store<appStore.State>,
    protected resolver: ComponentFactoryResolver,
    private mediaUploaderDataService: MediaUploaderDataService,
    private router: Router
  ) {
    super(resolver, store);

    this.objects$ = this.store.select(appStore.selectObjects);
    this.nextLink$ = this.store.select(appStore.selectNextLink);
    this.loading$ = this.store.select(appStore.selectLoading);
  }

  ngOnInit() {
    this.doEvent({ action: 'getAll', payload: {path: this.path, queryParams: {}}});
  }

  doEvent(event: any) {
    super.doEvent(event);

    switch (event.action) {
      case 'sort':
        this.store.dispatch(new GetAll({path: this.path, queryParams: {...event.payload.queryParams}}));
        break;
      case 'openUploadModal':
        this.mediaUploaderDataService.onShowUp();
        break;
      case 'addAlbumSuccessful':
        this.store.dispatch(new AddSuccess(event.payload));
        break;
      case 'favourite':
        this.store.dispatch(new Favorite(event.payload));
        break;
      case 'viewDetails':
        this.viewDetails(event.payload);
        break;
      case 'deleteMedia':
        this.store.dispatch(new DeleteMany({ ...event.payload }));
        break;
    }
  }

  viewDetails(payload: any) {
    const object = payload.selectedObject;
      this.router.navigate(['shared-with-me', object.uuid], {queryParams: {returnUrl: this.router.url}});
  }
}
