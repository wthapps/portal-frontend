import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'z-media-share-toolbar-album',
  templateUrl: 'album.component.html'
})

export class ZMediaToolbarAlbumComponent {
  @Input() selectedAlbums: any;
  @Input() hasFavourite: any;
  @Input() currentView: any;
  @Output() outEvent: EventEmitter<any> = new EventEmitter<any>();

  onAction(action: string, hasFavourite?: boolean) {
    this.outEvent.emit(action);
    return false;
  }
}
