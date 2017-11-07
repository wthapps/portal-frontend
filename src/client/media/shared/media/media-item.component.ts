import { Component, Input, EventEmitter, Output, HostBinding, OnChanges, ViewEncapsulation } from '@angular/core';
import { Constants } from '../../../core/shared/config/constants';

@Component({
  moduleId: module.id,
  encapsulation: ViewEncapsulation.None,
  selector: 'me-item',
  templateUrl: 'media-item.component.html',
  styleUrls: ['media-item.component.css']
})
export class MediaItemComponent implements OnChanges {
  @HostBinding('class') cssClass = 'row-img-item';
  @Input() type: string = 'photo';
  @Input() object: any;

  @Output() events: EventEmitter<any> = new EventEmitter<any>();

  readonly DEFAULT_IMAGE = Constants.img.default;
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
