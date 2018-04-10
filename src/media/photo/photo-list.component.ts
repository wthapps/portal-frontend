import { Component, ViewChild, OnInit, ComponentFactoryResolver } from '@angular/core';
import { Router } from '@angular/router';


import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
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
import { MediaUploaderDataService } from '@media/shared/uploader/media-uploader-data.service';
import { Constants } from '@wth/shared/constant';
import { DynamicModal } from '@media/shared/modal/dynamic-modal';
import { WthConfirmService } from '@wth/shared/shared/components/confirmation/wth-confirm.service';
import {
  MediaRenameModalComponent,
  SharingModalComponent,
  TaggingModalComponent,
  AddToAlbumModalComponent,
  AlbumCreateModalComponent,
  PhotoEditModalComponent
} from '@media/shared/modal';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'me-photo-list',
  templateUrl: 'photo-list.component.html',
  entryComponents: [
    MediaRenameModalComponent,
    SharingModalComponent,
    TaggingModalComponent,
    AlbumCreateModalComponent,
    AddToAlbumModalComponent,
    PhotoEditModalComponent
  ]
})
export class ZMediaPhotoListComponent extends DynamicModal implements OnInit {
  photos$: Observable<any>;
  loading$: Observable<any>;
  nextLink$: Observable<any>;
  tooltip: any = Constants.tooltip;
  objectType = 'photo';

  constructor(
    private store: Store<appStore.State>,
    protected resolver: ComponentFactoryResolver,
    private mediaUploaderDataService: MediaUploaderDataService,
    private router: Router,
    private confirmService: WthConfirmService
  ) {
    super(resolver);

    this.photos$ = this.store.select(appStore.selectObjects);
    this.nextLink$ = this.store.select(appStore.selectNextLink);
    this.loading$ = this.store.select(appStore.selectLoading);
  }

  ngOnInit() {
    this.doEvent({ action: 'getAll', payload: {path: 'media/media', queryParams: {type: 'photo'}}});
  }

  doEvent(event: any) {
    console.log('event actions:::', event.action, event.payload);

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
      case 'preview':
        this.preview(event.payload);
        break;
      case 'editName':
      case 'editInfo':
        this.store.dispatch(new Update(event.params.selectedObject));
        break;
      case 'deleteMedia':
        this.confirmService.confirm({
          header: 'Delete photo',
          acceptLabel: 'Delete',
          message: `Are you sure to delete ${event.payload.selectedObjects.length} photos`,
          accept: () => {
            this.store.dispatch(new DeleteMany({...event.payload}));
          }});
        break;
    }
  }

  preview(payload: any) {
    const objects = payload.selectedObjects;
    const ids = _.map(objects, 'id');

    this.router.navigate([{
        outlets: {
          modal: [
            'photos',
            objects[0].id,
            {ids: ids, mode: 0}
          ]
        }
      }], {queryParamsHandling: 'preserve', preserveFragment: true}
    );
  }

  viewDetails(payload: any) {
    const object = payload.selectedObject;

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
