import { Component, Input, EventEmitter, Output, HostBinding, OnChanges } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'me-item',
  templateUrl: 'media-item.component.html'
})
export class MediaItemComponent implements OnChanges {
  @HostBinding('class') leftBarClass = 'row-img-item';
  @Input() type: string = 'photo';
  @Input() object: any;

  @Output() events: EventEmitter<any> = new EventEmitter<any>();

  // Mapping map path from list to detail: photos => photo, albums => album
  readonly LIST_ITEM_TYPE_MAP = {
    'photos': 'photo',
    'albums': 'album',
    'favorites': 'mix',
    'shared-with-me': 'mix',
  };
  ngOnChanges() {

  }

  onAction(options: any) {
    this.events.emit(options);
  }
}
