import { LoadModalAble } from '@shared/shared/mixins/modal/load-modal-able.mixin';
import { Mixins } from '@shared/design-patterns/decorator/mixin-decorator';
import { ViewContainerRef, ViewChild, ComponentFactoryResolver } from '@angular/core';

import { AlbumEditModalComponent } from '@shared/components/modal/album/album-edit-modal.component';
import { PhotoEditModalComponent } from '../components/modal/photo/photo-edit-modal.component';
import { MediaRenameModalComponent } from '../components/modal/media/media-rename-modal.component';
@Mixins([LoadModalAble])
export class MediaModalMixin implements LoadModalAble {
  modalIns: any;
  modalRef: any;
  @ViewChild('modalContainer', { read: ViewContainerRef }) modalContainer: ViewContainerRef;

  constructor(public resolver: ComponentFactoryResolver) { }

  loadModalComponent: (component: any) => void;

  // openEditModal:(object: any) => void;
  // onAfterEditModal:() => void;
  openEditModal(object: any) {
    let options: any;
    if (object.model === 'Media::Photo' || object.model === 'Media::Video') {
      this.loadModalComponent(PhotoEditModalComponent);
      options = { selectedObject: object };
    }
    if (object.model === 'Media::Album' || object.model === 'Media::Playlist') {
      this.loadModalComponent(AlbumEditModalComponent);
      options = { selectedObject: object };
    }
    if (object.model === 'Common::Sharing') {
      this.loadModalComponent(MediaRenameModalComponent);
      options = { selectedObject: object };
    }
    if (this.modalIns) {
      this.modalIns.open(options);
    }
    this.onAfterEditModal();
  }

  onAfterEditModal() {
    /* this method is load objects to display on init */
    throw new Error('should overwrite this method');
  }
}
