import { Component, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { ZMediaFormAddToAlbumComponent } from '../form/form-add-to-album.component';
import { ZMediaFormEditAlbumComponent } from '../form/form-edit-album.component';

@Component({
  moduleId: module.id,
  selector: 'z-media-share-toolbar',
  templateUrl: 'toolbar.component.html'
})

export class ZMediaToolbarComponent {
  @ViewChild('formAddAlbum') formAddAlbum: ZMediaFormAddToAlbumComponent;
  @ViewChild('formEditAlbum') formEditAlbum: ZMediaFormEditAlbumComponent;


  @Input() type: string = '';
  @Input() selectedPhotos: any;
  @Input() hasFavourite: any;
  @Input() currentView: any;
  @Output() outEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() outEventUploading: EventEmitter<any> = new EventEmitter<any>();

  onAction(action: string) {
    switch (action) {
      case 'addToAlbum':
        this.formAddAlbum.getAlbum();
        this.formAddAlbum.modal.open();
        break;
      default:
        this.outEvent.emit(action);
        break;
    }

    return false;
  }

  onActionUploading(event: any) {
    switch (event.action) {
      case 'addToAlbum':
        this.formAddAlbum.selectedPhotos = event.data;
        this.formAddAlbum.getAlbum();
        this.formAddAlbum.modal.open();
        break;
      case 'createAlbum':
        this.formEditAlbum.selectedPhotos = event.data;
        this.formEditAlbum.modal.open();
        break;
      case 'addPhoto':
        this.selectedPhotos.length = 0;
        this.outEventUploading.emit(event);
        break;
      default:
        break;
    }
  }
}
