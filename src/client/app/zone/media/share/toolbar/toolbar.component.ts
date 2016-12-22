import { Component, OnChanges, Input, EventEmitter, Output } from '@angular/core';

declare var _: any;


@Component({
  moduleId: module.id,
  selector: 'z-media-share-toolbar',
  templateUrl: 'toolbar.component.html'
})

export class ZMediaToolbarComponent implements OnChanges {
  @Input() data: any;
  @Input() hasFavourite: any;
  @Output() outEvent: EventEmitter<any> = new EventEmitter<any>();

  onAction(action: string) {
    this.outEvent.emit(action);
    return false;
  }

  ngOnChanges() {

  }
}
