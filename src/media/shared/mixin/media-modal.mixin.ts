import { LoadModalAble } from '@shared/shared/mixins/modal/load-modal-able.mixin';
import { Mixin } from '@shared/design-patterns/decorator/mixin-decorator';
import { ViewContainerRef, ViewChild, ComponentFactoryResolver } from '@angular/core';
import { PhotoEditModalComponent } from '@shared/shared/components/photo/modal/photo/photo-edit-modal.component';
import { AlbumEditModalComponent } from '@media/shared/modal';
import { MediaRenameModalComponent } from '@shared/shared/components/photo/modal/media/media-rename-modal.component';
@Mixin([LoadModalAble])
export class MediaModalMixin implements LoadModalAble {
  modalIns: any;
  modalRef: any;
  @ViewChild('modalContainer', { read: ViewContainerRef }) modalContainer: ViewContainerRef;

  constructor(public resolver: ComponentFactoryResolver) { }

  loadModalComponent:(component: any) => void;

  openEditModal(object: any) {
    let options: any;
    if(object.model == 'Media::Photo') {
      this.loadModalComponent(PhotoEditModalComponent);
      options = {selectedObject: object}
    }
    if (object.model == 'Media::Album' || object.model == 'Media::Playlist') {
      this.loadModalComponent(AlbumEditModalComponent);
      options = {selectedObject: object}
    }
    if(object.model == 'Common::Sharing') {
      this.loadModalComponent(MediaRenameModalComponent);
      options = {selectedObject: object}
    }
    if (this.modalIns) {
      this.modalIns.open(options);
    }
    this.onAfterEditModal();
  }

  onAfterEditModal(){
    /* this method is load objects to display on init */
    throw new Error('should overwrite this method');
  }
}
