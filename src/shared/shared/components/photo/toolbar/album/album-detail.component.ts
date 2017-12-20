import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Constants } from '../../../../../constant/config/constants';

@Component({
    selector: 'z-media-share-toolbar-album-detail',
  templateUrl: 'album-detail.component.html'
})

export class ZMediaToolbarAlbumDetailComponent {
  @Input() selectedAlbums: any;
  @Input() hasFavourite: any;
  @Input() currentView: any;
  @Output() outEvent: EventEmitter<any> = new EventEmitter<any>();

  tooltip: any = Constants.tooltip;

  onAction(action: string) {
    this.outEvent.emit(action);
    return false;
  }
}
