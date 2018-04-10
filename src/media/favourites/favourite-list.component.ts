import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { MediaUploaderDataService } from '@media/shared/uploader/media-uploader-data.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Constants } from '@wth/shared/constant';
import * as appStore from '../shared/store';
import {
  Select,
  SelectAll,
  Deselect,
  DeselectAll,
  GetAll,
  GetMore,
  Favorite,
  Update,
  AddSuccess,
  DeleteMany
} from '../shared/store/media/media.actions';
import { DynamicModal } from '@media/shared/modal/dynamic-modal';

import {
  MediaRenameModalComponent,
  SharingModalComponent,
  TaggingModalComponent,
  AddToAlbumModalComponent,
  AlbumEditModalComponent,
  PhotoEditModalComponent
} from '@media/shared/modal';


@Component({
  moduleId: module.id,
  selector: 'me-favourite-list',
  templateUrl: 'favourite-list.component.html',
  entryComponents: [
    MediaRenameModalComponent,
    SharingModalComponent,
    TaggingModalComponent,
    AlbumEditModalComponent,
    PhotoEditModalComponent,
    AddToAlbumModalComponent
  ]
})
export class ZMediaFavoriteListComponent extends DynamicModal implements OnInit {
  favoriteObjects$: Observable<any>;
  loading$: Observable<any>;
  nextLink$: Observable<any>;
  tooltip: any = Constants.tooltip;

  constructor(
    private store: Store<appStore.State>,
    protected resolver: ComponentFactoryResolver,
    private mediaUploaderDataService: MediaUploaderDataService,
    private router: Router
  ) {
    super(resolver);

    this.favoriteObjects$ = this.store.select(appStore.selectObjects);
    this.nextLink$ = this.store.select(appStore.selectNextLink);
    this.loading$ = this.store.select(appStore.selectLoading);
  }

  ngOnInit() {
    this.doEvent({ action: 'getAll', payload: {path: 'media/favorites', queryParams: {}} });
  }

  doEvent(event: any) {
    switch (event.action) {
      case 'getAll':
        this.store.dispatch(new GetAll({...event.payload}));
        break;
      case 'getMore':
        this.store.dispatch(new GetMore({...event.payload}));
        break;
      case 'sort':
        this.store.dispatch(new GetAll({...event.payload}));
        break;
      case 'select':
        this.store.dispatch(new Select(event.payload));
        break;
      case 'selectAll':
        this.store.dispatch(new SelectAll());
        break;
      case 'deselect':
        this.store.dispatch(new Deselect({selectedObjects: event.payload.selectedObjects}));
        break;
      case 'deselectAll':
        this.store.dispatch(new DeselectAll());
        break;
      case 'openModal':
        this.openModal(event.payload);
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
      case 'editName':
      case 'editInfo':
        this.store.dispatch(new Update(event.params.selectedObject));
        break;
      case 'deleteMedia':
        this.store.dispatch(new DeleteMany({...event.payload }));
        break;
    }
  }

  viewDetails(payload: any) {
    const object = payload.selectedObject;
    if (object.object_type === 'album') {
      this.router.navigate(['albums', object.id], {queryParams: {returnUrl: this.router.url}});
    } else {
      this.router.navigate([{
          outlets: {
            ['modal']: [
              `photos`,
              object.id,
              {ids: [object.id], mode: 0}
            ]
          }
        }], {queryParamsHandling: 'preserve', preserveFragment: true}
      );
    }
  }
}
