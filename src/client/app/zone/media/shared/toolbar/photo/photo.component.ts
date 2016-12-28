import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'z-media-share-toolbar-photo',
  templateUrl: 'photo.component.html'
})

export class ZMediaToolbarPhotoComponent {
  @Input() data: any;
  @Input() hasFavourite: any;
  @Input() currentView: any;
  @Output() outEvent: EventEmitter<any> = new EventEmitter<any>();

  onAction(action: string) {
    this.outEvent.emit(action);
    return false;
  }
}
