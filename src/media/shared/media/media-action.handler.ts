import { ComponentFactoryResolver, ViewChild, ViewContainerRef, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import * as appStore from '@media/shared/store';
import * as mediaActions from '@media/shared/store/media/media.actions';
import { MediaRenameModalComponent } from '@wth/shared/shared/components/photo/modal/media/media-rename-modal.component';
import { SharingModalComponent } from '@wth/shared/shared/components/photo/modal/sharing/sharing-modal.component';
import { TaggingModalComponent } from '@wth/shared/shared/components/photo/modal/tagging/tagging-modal.component';
import { PhotoEditModalComponent } from '@wth/shared/shared/components/photo/modal/photo/photo-edit-modal.component';
import { AddToAlbumModalComponent } from '@wth/shared/shared/components/photo/modal/photo/add-to-album-modal.component';

import { AlbumCreateModalComponent, AlbumEditModalComponent, AlbumDeleteModalComponent } from '@shared/components/modal/album';


export class MediaActionHandler implements OnDestroy {
  @ViewChild('modalContainer', {read: ViewContainerRef}) modalContainer: ViewContainerRef;
  modalComponent: any;
  modal: any;
  sub: any;
  subSelect: any;

  constructor(
    protected resolver: ComponentFactoryResolver,
    protected store: Store<appStore.State>,
    protected mediaSelectionService: any = null
  ) {}

  protected loadModalComponent(component: any) {
    this.modalContainer.clear();

    const modalComponentFactory = this.resolver.resolveComponentFactory(component);
    this.modalComponent = this.modalContainer.createComponent(modalComponentFactory);
    this.modal = this.modalComponent.instance;

    // handle all of action from modal all
    this.modal.event.takeUntil(this.destroySubject).subscribe((event: any) => {
      this.doEvent(event);
    });
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
    if (this.subSelect) this.subSelect.unsubscribe();
  }

  openModal(payload: any, mediaSelectionService: any) {
    let options: any;
    switch (payload.modalName) {
      case 'createAlbumModal':
        this.loadModalComponent(AlbumCreateModalComponent);
        options = {selectedObjects: payload.selectedObjects || []};
        break;
      case 'editNameModal':
        this.loadModalComponent(MediaRenameModalComponent);
        options = {selectedObject: payload.selectedObject};
        break;
      case 'sharingModal':
        this.loadModalComponent(SharingModalComponent);
        options = {
          selectedObjects: payload.selectedObjects,
          mode: payload.mode || 0,
          sharing: payload.sharing || undefined
        };
        break;
      case 'taggingModal':
        this.loadModalComponent(TaggingModalComponent);
        options = payload;
        break;
      case 'editInfoModal':
        if (payload.selectedObject.object_type === 'album') {
          this.loadModalComponent(AlbumEditModalComponent);
        } else {
          this.loadModalComponent(PhotoEditModalComponent);
        }
        options = {selectedObject: payload.selectedObject};
        break;
      case 'deleteModal':
        this.loadModalComponent(AlbumDeleteModalComponent);
        options = {selectedObjects: payload.selectedObjects};
        break;
      case 'addToAlbumModal':
        this.loadModalComponent(AddToAlbumModalComponent);
        // Take selected photos from photo list screen OR uploaded photos from upload photo component
        options = {selectedObjects: payload.selectedObjects};
        break;
      case 'photosSelectModal':
        mediaSelectionService.open();
        if (this.subSelect) this.subSelect.unsubscribe();
        this.subSelect = mediaSelectionService.selectedMedias$.filter((items: any[]) => items.length > 0)
          .subscribe(photos => {
            this.doEvent({action: 'addToParent', payload: {photos: photos }});
          });
        if (this.sub)  this.sub.unsubscribe();
        this.sub = mediaSelectionService.uploadingMedias$
          .map(([file, dataUrl]) => [file])
          .subscribe((photos: any) => {
          this.doEvent({action: 'addToParent', payload: {photos: photos, uploading: true }});
        });
        break;
      default:
        break;
    }
    if (this.modal) {
      this.modal.open(options);
    }

  }

  protected doEvent(event) {
    switch (event.action) {
      // selection
      case 'select':
        this.store.dispatch(new mediaActions.Select(event.payload));
        break;
      case 'selectAll':
        this.store.dispatch(new mediaActions.SelectAll());
        break;
      case 'deselect':
        this.store.dispatch(new mediaActions.Deselect({selectedObjects: event.payload.selectedObjects}));
        break;
      case 'deselectAll':
        this.store.dispatch(new mediaActions.DeselectAll());
        break;

      // get data
      case 'getAll':
        this.store.dispatch(new mediaActions.GetAll({...event.payload}));
        break;
      case 'getMore':
        this.getMore(event);
        break;

      // update data
      case 'editName':
      case 'editInfo':
        this.store.dispatch(new mediaActions.Update(event.params.selectedObject));
        break;

      // open modal
      case 'openModal':
        this.openModal(event.payload, this.mediaSelectionService);
        break;
      }
  }

  protected getMore(event: any) {
    this.store.dispatch(new mediaActions.GetMore({...event.payload}));
  }

  protected destroySubject() {
    this.sub.unsubscribe();
  }
}
