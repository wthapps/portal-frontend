import { Component, ViewChild, OnInit, ComponentFactoryResolver } from '@angular/core';
import { UserService } from '@wth/shared/services';
// import { PhotoSandbox } from './photo.sandbox';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as appStore from '../shared/store';
import * as fromMedia from '../shared/store/album/album.action';
import { Router } from '@angular/router';
import { MediaUploaderDataService } from '@media/shared/uploader/media-uploader-data.service';
import { Constants } from '@wth/shared/constant';
import { DynamicModal } from '@media/shared/modal/dynamic-modal';
import { AlbumCreateModalComponent, AlbumDeleteModalComponent } from '@media/shared/modal';
import { BaseObjectEditNameModalComponent } from '@wth/shared/shared/components/photo/modal/base-object-edit-name-modal.component';
import { SharingModalComponent } from '@wth/shared/shared/components/photo/modal/sharing/sharing-modal.component';
import { AlbumEditModalComponent } from '@shared/shared/components/photo/modal/album-edit-modal.component';
import { TaggingModalComponent } from '@wth/shared/shared/components/photo/modal/tagging/tagging-modal.component';
import { AddToAlbumModalComponent } from '@wth/shared/shared/components/photo/modal/add-to-album-modal.component';
import { WthConfirmService } from '@wth/shared/shared/components/confirmation/wth-confirm.service';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'me-photo-list',
  templateUrl: 'photo-list.component.html',
  entryComponents: [
    AlbumCreateModalComponent,
    BaseObjectEditNameModalComponent,
    SharingModalComponent,
    TaggingModalComponent,
    AlbumDeleteModalComponent,
    AlbumEditModalComponent,
    AddToAlbumModalComponent
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
        this.store.dispatch(
          new fromMedia.GetAll({ ...event.payload})
        );
        break;
      case 'getMore':
        this.store.dispatch(
          new fromMedia.GetMore({ ...event.payload})
        );
        break;
      case 'sort':
        this.store.dispatch(new fromMedia.GetAll({
          ...event.payload}));
        break;
      case 'select':
        this.store.dispatch(new fromMedia.Select(event.payload));
        break;
      case 'selectAll':
        this.store.dispatch(new fromMedia.SelectAll());
        break;
      case 'deselect':
        this.store.dispatch(
          new fromMedia.Deselect({
            selectedObjects: event.payload.selectedObjects
          })
        );
        break;
      case 'deselectAll':
        this.store.dispatch(new fromMedia.DeselectAll());
        break;
      case 'openModal':
        this.openModal(event.payload);
        break;
      case 'openUploadModal':
        this.mediaUploaderDataService.onShowUp();
        break;
      case 'addAlbumSuccessful':
        this.store.dispatch(new fromMedia.AddSuccess(event.payload));
        break;
      case 'favourite':
        this.store.dispatch(new fromMedia.Favorite(event.payload));
        break;
      case 'viewDetails':
        this.viewDetails(event.payload);
        break;
      case 'preview':
        this.preview(event.payload);
        break;
      case 'editName':
      case 'editInfo':
        this.store.dispatch(new fromMedia.Update(event.params.selectedObject));
        break;
      case 'deleteMedia':
        this.confirmService.confirm({
          header: 'Delete photo',
          acceptLabel: 'Delete',
          message: `Are you sure to delete ${event.payload.selectedObjects.length} photos`,
          accept: () => {
            this.store.dispatch(new fromMedia.DeleteMany({...event.payload}));
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
      }], {preserveQueryParams: true, preserveFragment: true}
    );

  }
}
