import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Constants } from '../../../../../constant/config/constants';

@Component({
    selector: 'z-media-share-toolbar-photo',
  templateUrl: 'photo.component.html'
})

export class ZMediaToolbarPhotoComponent {
  @Input() selectedPhotos: any;
  @Input() hasFavourite: any;
  @Input() currentView: any;
  @Output() outEvent: EventEmitter<any> = new EventEmitter<any>();

  tooltip: any = Constants.tooltip;

  onAction(action: string) {
    if (action === 'favourite')
      this.hasFavourite = !this.hasFavourite;
    this.outEvent.emit(action);
    return false;
  }
}
