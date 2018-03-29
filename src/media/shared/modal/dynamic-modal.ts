import { ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
import { AlbumCreateModalComponent, AlbumDeleteModalComponent } from '@media/shared/modal';
import { BaseObjectEditNameModalComponent } from '@wth/shared/shared/components/photo/modal/base-object-edit-name-modal.component';
import { SharingModalComponent } from '@wth/shared/shared/components/photo/modal/sharing/sharing-modal.component';
import { TaggingModalComponent } from '@wth/shared/shared/components/photo/modal/tagging/tagging-modal.component';
import { AlbumEditModalComponent } from '@wth/shared/shared/components/photo/modal/album-edit-modal.component';

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

  openModal(payload: any) {
    let options: any;
    switch (payload.modalName) {
      case 'createAlbumModal':
        this.loadModalComponent(AlbumCreateModalComponent);
        options = {selectedObjects: []};
        break;
      case 'editNameModal':
        this.loadModalComponent(BaseObjectEditNameModalComponent);
        options = {selectedObject: payload.selectedObject};
        break;
      case 'sharingModal':
        this.loadModalComponent(SharingModalComponent);
        var objects = _.get(payload, 'selectedObjects', []).concat([]);
        options = {selectedObjects: objects, updateListObjects: payload.updateListObjects};
        break;
      case 'taggingModal':
        this.loadModalComponent(TaggingModalComponent);
        if (payload.object) {
          options = {selectedObjects: []};
        } else {
          options = {selectedObjects: []};
        }
        break;
      case 'editInfoModal':
        this.loadModalComponent(AlbumEditModalComponent);
        options = {selectedObject: payload.selectedObject};
        break;
      case 'deleteModal':
        this.loadModalComponent(AlbumDeleteModalComponent);
        options = {selectedObjects: payload.selectedObjects};
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
