import { Component, Input, EventEmitter, Output, HostBinding, OnChanges, ViewEncapsulation } from '@angular/core';
import { Constants } from '@wth/shared/constant';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'w-grid-list-item',
  templateUrl: 'grid-list-item.component.html',
  styleUrls: ['grid-list-item.component.scss']
})
export class WGridListItemComponent implements OnChanges {
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
