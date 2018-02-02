import { Component, Input, EventEmitter, Output, HostBinding, OnChanges, ViewEncapsulation } from '@angular/core';
import { Constants } from '@wth/shared/constant';

@Component({
  moduleId: module.id,
  encapsulation: ViewEncapsulation.None,
  selector: 'me-sharing-item',
  templateUrl: 'sharing-item.component.html',
  styleUrls: ['sharing-item.component.scss']
})
export class SharingItemComponent implements OnChanges {
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

  onEvent(event: any) {
    this.events.emit(event);
  }

  test(event: any) {
    event.target.parentElement.parentElement.parentElement.stopPropagation();
  }
}
