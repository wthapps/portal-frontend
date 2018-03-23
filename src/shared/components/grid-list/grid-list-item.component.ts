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
    let object = item;
    object.selected = true;
    this.doAction({action: 'select', payload: {selectedObjects: [object], clearAll: true }});
  }

  toggleSelection(item: any, event: any) {
    let action = 'select';
    let object = item;
    if (item.selected){
      action = 'deselect';
      object.selected = false;
    }
    else {
      action = 'select';
      object.selected = true;
    }
    this.doAction({action: action, payload: { selectedObjects: [object] }});
    event.stopPropagation();
  }

  editName(item: any, event: any) {
    event.stopPropagation();
    this.doAction({action:'openModal', payload: {modalName: 'editNameModal', selectedObject: item }});
  }
}
