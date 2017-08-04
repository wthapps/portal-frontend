import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Constants } from '../../../../config/constants';

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

  tooltip: any = Constants.tooltip;

  onAction(action: string, hasFavourite?: boolean) {
    this.outEvent.emit(action);
    return false;
  }
}
