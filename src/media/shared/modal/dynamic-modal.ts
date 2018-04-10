import { ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
import {
  AlbumCreateModalComponent,
  AlbumDeleteModalComponent,
  SharingModalComponent,
  TaggingModalComponent
} from '@media/shared/modal';
import { AlbumEditModalComponent } from '@media/shared/modal/album/album-edit-modal.component';
import { PhotoEditModalComponent } from '@media/shared/modal/photo/photo-edit-modal.component';
import { AddToAlbumModalComponent } from '@media/shared/modal/photo/add-to-album-modal.component';
import { MediaRenameModalComponent } from '@media/shared/modal/media/media-rename-modal.component';

export class DynamicModal {
  @ViewChild('modalContainer', {read: ViewContainerRef}) modalContainer: ViewContainerRef;
  modalComponent: any;
  modal: any;

  constructor(protected resolver: ComponentFactoryResolver) {}

  protected loadModalComponent(component: any) {
    this.modalContainer.clear();

    let modalComponentFactory = this.resolver.resolveComponentFactory(component);
    this.modalComponent = this.modalContainer.createComponent(modalComponentFactory);
    this.modal = this.modalComponent.instance;

    // handle all of action from modal all
    this.modal.event.takeUntil(this.destroySubject).subscribe((event: any) => {
      this.doEvent(event);
    });
  }

  openModal(payload: any, mediaSelectionService?: any) {
    let options: any;
    switch (payload.modalName) {
      case 'createAlbumModal':
        this.loadModalComponent(AlbumCreateModalComponent);
        options = {selectedObjects: []};
        break;
      case 'editNameModal':
        this.loadModalComponent(MediaRenameModalComponent);
        options = {selectedObject: payload.selectedObject};
        break;
      case 'sharingModal':
        this.loadModalComponent(SharingModalComponent);
        options = {selectedObjects: payload.selectedObjects};
        break;
      case 'taggingModal':
        this.loadModalComponent(TaggingModalComponent);
        options = {selectedObjects: payload.selectedObjects};
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
        mediaSelectionService.open('photos');
        mediaSelectionService.setMultipleSelection(true);

        mediaSelectionService.selectedMedias$.filter((items: any[]) => items.length > 0)
          .subscribe(photos => {
            this.doEvent({action: 'addToParent', payload: {photos: photos }});
          });
        mediaSelectionService.uploadingMedias$.subscribe((photos: any) => {
          this.doEvent({action: 'addToParent', payload: {photos: photos }});
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

  }

  protected destroySubject() {

  }
}
