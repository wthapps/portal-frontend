import { Component, Input, EventEmitter, Output, HostBinding, OnChanges, ViewEncapsulation } from '@angular/core';
import { Constants } from '@wth/shared/constant';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'w-grid-list-item',
  templateUrl: 'grid-list-item.component.html',
  styleUrls: ['grid-list-item.component.scss']
})
export class WGridListItemComponent {
  @HostBinding('class') cssClass = 'row-img-item';
  @Input() type: string = 'photo';
  @Input() object: any;

  @Output() event: EventEmitter<any> = new EventEmitter<any>();


  readonly DEFAULT_IMAGE = Constants.img.default;
  // Mapping map path from list to detail: photos => photo, albums => album
  readonly LIST_ITEM_TYPE_MAP = {
    'photos': 'photo',
    'albums': 'album',
    'favorites': 'mix',
    'shared-with-me': 'mix',
  };


  doAction(event: any) {
    this.event.emit(event);
  }

  select(item: any) {
    this.doAction({action: 'select', payload: {selectedObjects: [item], clearAll: false }});
  }

  toggleSelection(item: any, event: any) {
    this.doAction({action: item.selected ? 'deselect' : 'select', payload: { selectedObjects: [item], checkbox: true}});
    event.stopPropagation();
  }

  editName(item: any, event: any) {
    event.stopPropagation();
    this.doAction({action:'openModal', payload: {modalName: 'editNameModal', selectedObject: item }});
  }
}
